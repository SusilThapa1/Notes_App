const PrivacyPolicy = () => {
  const PrivacyPolicy = [
    {
      heading: "📝 Information We Collect",
      subContent: [
        "Username, email address, phone number, and gender.",
        "Uploaded files (PDFs, notes, etc).",
        "Profile image, if added.",
        "IP address and browser information (for analytics and security).",
      ],
    },
    {
      heading: "⚙️ How We Use Your Information",
      subContent: [
        "To manage your account and display uploaded content.",
        "To contact you regarding your account or site updates.",
        "To improve and secure the website experience.",
      ],
    },
    {
      heading: "🔒 Data Protection",
      subContent: [
        "We store your data securely and do not share it with third parties.",
        "We use proper encryption and secure database practices.",
      ],
    },
    {
      heading: "🧩 Third-Party Services",
      subContent: [
        "We may use services like Google Fonts, or image upload tools.",
        "They may collect limited data under their own privacy policies.",
      ],
    },
    {
      heading: "🧑‍⚖️ Your Rights",
      subContent: [
        "You can delete your account or data anytime by yourself.",
        "You can also contact us through the website to request data deletion.",
      ],
    },
    {
      heading: "🔁 Updates",
      subContent: [
        "We may update this Privacy Policy anytime.",
        "Changes will be posted here with a new 'Last Updated' date.",
      ],
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-10 max-w-7xl mx-auto mt-20 px-6 pb-5  text-gray-800 leading-relaxed">
      <h1 className="text-2xl font-bold  text-[#5CAE59] text-center">
        Pricacy & Policy
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center  gap-8 text-justify  ">
        {PrivacyPolicy.map((section, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 p-6 rounded-3xl md:rounded-2xl  shadow-lg   bg-transparent border  border-slate-100 md:hover:scale-105 transition-all duration-500"
          >
            <h2 className="font-bold  text-green-600"> {section.heading}</h2>
            <ul className="list-disc ml-5 mt-2 text-gray-700 space-y-5">
              {section.subContent.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">Last updated: May 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
