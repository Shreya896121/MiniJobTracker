import prisma from "../src/prisma";

async function main() {
  await prisma.application.deleteMany();

  console.log("Seeding initial applications...");

  const applications = [
    {
      companyName: "Google",
      jobTitle: "Software Engineer - Frontend",
      jobType: "FULL_TIME" as const,
      status: "INTERVIEWING" as const,
      appliedDate: new Date("2026-06-10T00:00:00.000Z"),
      notes: "First round technical interview scheduled for June 22nd.",
    },
    {
      companyName: "Meta",
      jobTitle: "Production Engineer Intern",
      jobType: "INTERNSHIP" as const,
      status: "OFFER" as const,
      appliedDate: new Date("2026-05-15T00:00:00.000Z"),
      notes: "Received verbal offer! Waiting on written offer letter.",
    },
    {
      companyName: "Microsoft",
      jobTitle: "Software Engineer - Cloud Platform",
      jobType: "FULL_TIME" as const,
      status: "REJECTED" as const,
      appliedDate: new Date("2026-05-01T00:00:00.000Z"),
      notes: "Rejected after final round interview. Focus on system design next time.",
    },
    {
      companyName: "Google",
      jobTitle: "Full Stack Engineer",
      jobType: "FULL_TIME" as const,
      status: "APPLIED" as const,
      appliedDate: new Date("2026-06-18T00:00:00.000Z"),
      notes: "Applied via referral. Resume status: pending.",
    },
    {
      companyName: "Netflix",
      jobTitle: "Senior Software Engineer - UI",
      jobType: "PART_TIME" as const,
      status: "APPLIED" as const,
      appliedDate: new Date("2026-06-19T00:00:00.000Z"),
      notes: "Submitted application online.",
    },
  ];

  for (const app of applications) {
    const created = await prisma.application.create({
      data: app,
    });
    console.log(`Created application for ${created.companyName} as ${created.jobTitle}`);
  }

  console.log("Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
