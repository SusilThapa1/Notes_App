import React from "react";

const CodeOfConduct = () => {
  const codeOfConduct = [
    {
      title: "✅ Respectful Behavior",
      subContent: [
        "Always be kind and polite in any interaction.",
        "No hate speech, harassment, or discrimination.",
        "Respect different opinions — don’t start fights.",
      ],
    },
    {
      title: "📁 Appropriate Content",
      subContent: [
        "Only upload notes or study-related files.",
        "No memes, personal photos, or copyrighted media.",
        "Organize files properly with correct naming.",
      ],
    },
    {
      title: "🔐 User Privacy",
      subContent: [
        "Never access or try to view other users' private notes.",
        "Do not share anyone’s uploaded content without their permission.",
        "All user data must be respected and not misused.",
      ],
    },
    {
      title: "🚫 No Abuse",
      subContent: [
        "Avoid uploading fake or misleading content.",
        "Don’t flood the app with duplicate notes or spam.",
        "No attempts to hack, crash, or exploit the system.",
      ],
    },
    {
      title: "🛠️ Use Features Properly",
      subContent: [
        "Use folder names and titles that are clear and meaningful.",
        "Do not upload unnecessary files to shared spaces.",
        "Use filters and upload tools responsibly.",
      ],
    },
    {
      title: "🧑‍💻 Admin Rights",
      subContent: [
        "Admins may remove content that breaks the rules.",
        "If someone violates rules repeatedly, admins can suspend their account.",
        "Decisions by admins must be respected.",
      ],
    },
    {
      title: "❤️ Positive Vibes Only",
      subContent: [
        "Help new users if they're confused.",
        "Report bugs or problems instead of complaining.",
        "Uplift the community. We're all here to learn together.",
      ],
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-10 max-w-7xl mx-auto mt-20 px-6 pb-5  text-gray-800 leading-relaxed">
      <h1 className="text-2xl font-bold  text-[#5CAE59] text-center">
        Code of Conduct
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center  gap-8 text-justify  ">
        {codeOfConduct.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-1 p-6 rounded-3xl md:rounded-2xl  shadow-lg   bg-transparent border  border-slate-100 md:hover:scale-105 transition-all duration-500"
          >
            <h2 className="font-bold  text-green-600">{item.title}</h2>
            <ul className="list-disc ml-5 mt-2 text-gray-700 space-y-5">
              {item.subContent.map((point, subIdx) => (
                <li key={subIdx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">Last updated: May 2025</p>
    </div>
  );
};

export default CodeOfConduct;
