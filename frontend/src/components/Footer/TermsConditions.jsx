const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto mt-20 px-6 pb-5  text-gray-800 leading-relaxed">
      <div className="flex flex-col justify-center items-center gap-2 w-full text-center  ">
        <h1 className="text-lg font-bold text-[#5CAE59]">Terms & Conditions</h1>
        <p className="font-medium">
          By using this website, you agree to the following terms and
          conditions.
        </p>
      </div>
      <div className="text-[12px] sm:text-sm md:text-[1.5vw] lg:text-[1vw]">
        <h2 className=" font-semibold mt-6 mb-2">1. Use of Content</h2>
        <p>
          You may view and download notes for educational purposes only. Do not
          redistribute or resell uploaded content.
        </p>

        <h2 className=" font-semibold mt-6 mb-2">2. Account Responsibility</h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account and uploaded content.
        </p>

        <h2 className=" font-semibold mt-6 mb-2">3. Uploaded Content</h2>
        <p>
          You may only upload original or permitted study material. Do not
          upload copyrighted or illegal files.
        </p>

        <h2 className=" font-semibold mt-6 mb-2">4. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account if you
          violate any of these terms.
        </p>

        <h2 className=" font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
        <p>
          We are not responsible for any damages caused by the use of this
          website or reliance on uploaded content.
        </p>

        <h2 className=" font-semibold mt-6 mb-2">6. Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of the site means
          you accept any changes.
        </p>
      </div>

      <p className="mt-6 text-sm text-gray-500 text-center">
        Last updated: May 2025
      </p>
    </div>
  );
};

export default TermsConditions;
