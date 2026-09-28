export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-black tracking-tighter text-gray-300 mb-4 md:mb-0">
          TodoMaster
        </div>
        <p className="text-gray-500 font-medium text-sm">© {new Date().getFullYear()} TodoMaster Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
