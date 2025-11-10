export default function LeftPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 lg:w-2/3 h-screen items-center justify-center bg-gradient-to-b from-brandGradientFrom to-brandGradientTo text-white">
      <div className="w-4/5 max-w-lg">
        <div className="mb-6">
          <div className="text-6xl font-extrabold"><img src="/Gemini_Generated_Image_o0uen0o0uen0o0ue-removebg-preview.png" alt="Logo" className="h-20" /></div>
        </div>
        <h1 className="text-4xl font-extrabold mb-4">
          Hello
          <br />
          Pensoic.com! 👋
        </h1>
        <p className="text-lg opacity-90">
          Manage master data, APIs, and platform configurations in one place —
          empowering your team to maintain system integrity, streamline
          workflows, and ensure data consistency across all services.
        </p>
        <div className="mt-10 text-sm opacity-80">
          © {new Date().getFullYear()} Pensoic.com All rights reserved.
        </div>
      </div>
    </div>
  );
}
