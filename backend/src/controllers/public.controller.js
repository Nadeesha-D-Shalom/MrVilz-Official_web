const { query, queryOne } = require("../config/db");

async function getContentByKey(key) {
  const row = await queryOne(
    "SELECT content_json FROM site_content WHERE content_key = :key LIMIT 1",
    { key }
  );
  if (!row) return null;
  return typeof row.content_json === "string"
    ? JSON.parse(row.content_json)
    : row.content_json;
}

async function getSiteData(_req, res, next) {
  try {
    const [hero, about, stats, socialLinks, team, projects] = await Promise.all([
      getContentByKey("hero"),
      getContentByKey("about"),
      query(
        `SELECT id, stat_key AS statKey, label, value, suffix
         FROM site_stats WHERE is_active = 1 ORDER BY sort_order ASC`
      ),
      query(
        `SELECT id, platform, label, url, icon
         FROM social_links WHERE is_active = 1 ORDER BY sort_order ASC`
      ),
      query(
        `SELECT id, name, slug, position, bio, image_url AS imageUrl
         FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC`
      ),
      query(
        `SELECT id, title, summary, progress, image_url AS imageUrl,
                visual_layout AS visualLayout, highlights
         FROM projects WHERE is_active = 1 ORDER BY sort_order ASC`
      )
    ]);

    const normalizedProjects = projects.map((project) => ({
      ...project,
      highlights:
        typeof project.highlights === "string"
          ? JSON.parse(project.highlights)
          : project.highlights || []
    }));

    return res.json({
      hero,
      about,
      stats,
      socialLinks,
      team,
      projects: normalizedProjects
    });
  } catch (error) {
    return next(error);
  }
}

async function getTeamMember(req, res, next) {
  try {
    const member = await queryOne(
      `SELECT id, name, slug, position, bio, image_url AS imageUrl
       FROM team_members WHERE slug = :slug AND is_active = 1 LIMIT 1`,
      { slug: req.params.slug }
    );
    if (!member) {
      return res.status(404).json({ message: "Team member not found." });
    }
    return res.json({ member });
  } catch (error) {
    return next(error);
  }
}

async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES (:name, :email, :phone, :subject, :message)`,
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim()
      }
    );

    return res.status(201).json({ message: "Thank you! Your message has been received." });
  } catch (error) {
    return next(error);
  }
}

async function getGallery(_req, res, next) {
  try {
    const items = await query(
      `SELECT id, title, caption, image_url AS imageUrl, category
       FROM gallery_items WHERE is_active = 1 ORDER BY sort_order ASC, id DESC`
    );
    return res.json({ items });
  } catch (error) {
    return next(error);
  }
}

function validatePersonalFields(body) {
  const { fullName, email, phone, address, city, age, gender } = body;

  if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !address?.trim() || !city?.trim()) {
    return { error: "Please complete all required personal fields." };
  }

  const parsedAge = Number(age);
  if (!parsedAge || parsedAge < 16 || parsedAge > 80) {
    return { error: "Please enter a valid age (16–80)." };
  }

  const allowedGender = ["male", "female", "other", "prefer_not_to_say"];
  if (!allowedGender.includes(gender)) {
    return { error: "Please select a valid gender option." };
  }

  return {
    data: {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      age: parsedAge,
      gender
    }
  };
}

async function submitJoinTeam(req, res, next) {
  try {
    const validation = validatePersonalFields(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { message } = req.body;

    await query(
      `INSERT INTO team_applications (full_name, email, phone, address, city, age, gender, message)
       VALUES (:fullName, :email, :phone, :address, :city, :age, :gender, :message)`,
      {
        ...validation.data,
        message: message?.trim() || null
      }
    );

    return res.status(201).json({
      message: "Thank you! We received your request to join the Mr Vilz team."
    });
  } catch (error) {
    return next(error);
  }
}

async function submitJobApplication(req, res, next) {
  try {
    const cvFile = req.files?.cv?.[0];
    if (!cvFile) {
      return res.status(400).json({ message: "CV / resume file is required for job applications." });
    }

    const validation = validatePersonalFields(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const {
      jobTitle,
      linkedinUrl,
      portfolioUrl,
      currentRole,
      experienceYears,
      coverLetter,
      additionalInfo
    } = req.body;

    if (!jobTitle?.trim()) {
      return res.status(400).json({ message: "Job title is required." });
    }

    const additionalFile = req.files?.additionalDoc?.[0];

    await query(
      `INSERT INTO job_applications (
        job_title, full_name, email, phone, address, city, age, gender,
        linkedin_url, portfolio_url, current_role, experience_years,
        cover_letter, cv_filename, cv_url, additional_doc_filename, additional_doc_url, additional_info
      ) VALUES (
        :jobTitle, :fullName, :email, :phone, :address, :city, :age, :gender,
        :linkedinUrl, :portfolioUrl, :currentRole, :experienceYears,
        :coverLetter, :cvFilename, :cvUrl, :additionalDocFilename, :additionalDocUrl, :additionalInfo
      )`,
      {
        jobTitle: jobTitle.trim(),
        ...validation.data,
        linkedinUrl: linkedinUrl?.trim() || null,
        portfolioUrl: portfolioUrl?.trim() || null,
        currentRole: currentRole?.trim() || null,
        experienceYears: experienceYears ? Number(experienceYears) : null,
        coverLetter: coverLetter?.trim() || null,
        cvFilename: cvFile.originalname,
        cvUrl: `/uploads/applications/${cvFile.filename}`,
        additionalDocFilename: additionalFile?.originalname || null,
        additionalDocUrl: additionalFile ? `/uploads/applications/${additionalFile.filename}` : null,
        additionalInfo: additionalInfo?.trim() || null
      }
    );

    return res.status(201).json({
      message: "Job application submitted successfully. We will review your profile."
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getSiteData,
  getTeamMember,
  submitContact,
  getGallery,
  submitJoinTeam,
  submitJobApplication
};
