export const buildForm = (u) => ({
  firstName: u?.firstName || "",
  lastName: u?.lastName || "",
  age: u?.age || "",
  gender: u?.gender || "",
  about: u?.about || "",
  headline: u?.headline || "",
  phone: u?.phone || "",

  skills: u?.skills || [],

  company: u?.company || "",
  location: u?.location || "",

  openToWork: u?.openToWork ?? false,
  jobType: u?.jobType || "",
  expectedSalary: u?.expectedSalary || "",

  preferredLanguages: u?.preferredLanguages || [],

  portfolio: u?.portfolio || "",
  githubId: u?.githubId || "",
  linkedIn: u?.linkedIn || "",
  twitterId: u?.twitterId || "",
  leetcodeId: u?.leetcodeId || "",
  codechefId: u?.codechefId || "",
  codeforcesId: u?.codeforcesId || "",
  hackerRankId: u?.hackerRankId || "",
  kaggleId: u?.kaggleId || "",
  mediumId: u?.mediumId || "",
  devToId: u?.devToId || "",
  npmId: u?.npmId || "",

  projects: u?.projects || [],
  certifications: u?.certifications || [],
  experience: u?.experience || [],

  tenth_school:
    u?.academicQualifications?.tenth?.school || "",
  tenth_board:
    u?.academicQualifications?.tenth?.board || "",
  tenth_pct:
    u?.academicQualifications?.tenth?.percentage || "",

  twelfth_school:
    u?.academicQualifications?.twelfth?.school || "",
  twelfth_board:
    u?.academicQualifications?.twelfth?.board || "",
  twelfth_pct:
    u?.academicQualifications?.twelfth?.percentage || "",

  ug_college:
    u?.academicQualifications?.ug?.college || "",
  ug_degree:
    u?.academicQualifications?.ug?.degree || "",
  ug_branch:
    u?.academicQualifications?.ug?.branch || "",
  ug_sgpa:
    u?.academicQualifications?.ug?.sgpa || "",

  pg_college:
    u?.academicQualifications?.pg?.college || "",
  pg_degree:
    u?.academicQualifications?.pg?.degree || "",
  pg_branch:
    u?.academicQualifications?.pg?.branch || "",
  pg_sgpa:
    u?.academicQualifications?.pg?.sgpa || "",
});
