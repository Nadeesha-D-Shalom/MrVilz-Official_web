const {
  SiteStat,
  SocialLink,
  TeamMember,
  Project,
  ContactMessage,
  GalleryItem,
  TeamApplication,
  JobApplication
} = require("../models");
const { getContentByKey } = require("../utils/content");
const {
  statPublic,
  teamPublic,
  projectPublic,
  galleryPublic
} = require("../utils/serialize");

async function getSiteData(_req, res, next) {
  try {
    const [hero, about, stats, socialLinks, teamRows, projects] = await Promise.all([
      getContentByKey("hero"),
      getContentByKey("about"),
      SiteStat.find({ is_active: 1 }).sort({ sort_order: 1 }).lean(),
      SocialLink.find({ is_active: 1 }).sort({ sort_order: 1 }).lean(),
      TeamMember.find({ is_active: 1 }).sort({ sort_order: 1 }).lean(),
      Project.find({ is_active: 1 }).sort({ sort_order: 1 }).lean()
    ]);

    const leadership = [];
    const teamMembers = [];
    for (const row of teamRows) {
      const item = teamPublic(row);
      if (row.is_leadership === 1) {
        leadership.push(item);
      } else {
        teamMembers.push(item);
      }
    }

    return res.json({
      hero,
      about,
      stats: stats.map(statPublic),
      socialLinks: socialLinks.map((l) => ({
        id: String(l._id),
        platform: l.platform,
        label: l.label,
        url: l.url,
        icon: l.icon
      })),
      team: leadership,
      teamMembers,
      projects: projects.map(projectPublic)
    });
  } catch (error) {
    return next(error);
  }
}

async function getTeamMember(req, res, next) {
  try {
    const member = await TeamMember.findOne({ slug: req.params.slug, is_active: 1 }).lean();
    if (!member) {
      return res.status(404).json({ message: "Team member not found." });
    }
    return res.json({ member: teamPublic(member) });
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

    await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || null,
      message: message.trim()
    });

    return res.status(201).json({ message: "Thank you! Your message has been received." });
  } catch (error) {
    return next(error);
  }
}

async function getGallery(_req, res, next) {
  try {
    const items = await GalleryItem.find({ is_active: 1 })
      .sort({ sort_order: 1, _id: -1 })
      .lean();
    return res.json({ items: items.map(galleryPublic) });
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
      full_name: fullName.trim(),
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

    await TeamApplication.create({
      ...validation.data,
      message: message?.trim() || null
    });

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

    await JobApplication.create({
      job_title: jobTitle.trim(),
      ...validation.data,
      linkedin_url: linkedinUrl?.trim() || null,
      portfolio_url: portfolioUrl?.trim() || null,
      current_role: currentRole?.trim() || null,
      experience_years: experienceYears ? Number(experienceYears) : null,
      cover_letter: coverLetter?.trim() || null,
      cv_filename: cvFile.originalname,
      cv_url: `/uploads/applications/${cvFile.filename}`,
      additional_doc_filename: additionalFile?.originalname || null,
      additional_doc_url: additionalFile ? `/uploads/applications/${additionalFile.filename}` : null,
      additional_info: additionalInfo?.trim() || null
    });

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
