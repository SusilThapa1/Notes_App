const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto mt-20 px-6 pb-5 text-gray-800 leading-relaxed">
      <div className="flex flex-col justify-center items-center gap-2 w-full">
        <h1 className="text-2xl font-bold  text-[#5CAE59]">Privacy Policy</h1>
        <p className="font-medium">
          This Privacy Policy explains how we collect, use, and protect your
          information when you use our website.
        </p>
      </div>
      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc list-inside">
        <li>Username, email address, phone number, and gender.</li>
        <li>Uploaded files (PDFs, notes, etc).</li>
        <li>Profile image, if added.</li>
        <li>
          IP address and browser information (for analytics and security).
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc list-inside">
        <li>To manage your account and display uploaded content.</li>
        <li>To contact you regarding your account or site updates.</li>
        <li>To improve and secure the website experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
      <p>
        We store your data securely and do not share it with third parties. We
        use proper encryption and secure database practices.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Third-Party Services
      </h2>
      <p>
        We may use services like Google Fonts, or image upload tools — they may
        collect limited data under their own privacy policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <p>
        You can delete your account or data anytime by yourself or by contacting
        us through the website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Updates</h2>
      <p>
        We may update this Privacy Policy. Any changes will be posted here with
        a new “Last Updated” date.
      </p>

      <p className="mt-6 text-sm text-gray-500">Last updated: May 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
