export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-2">
      <span className="text-sm">9:41</span>
      <div className="flex items-center gap-1">
        <div className="flex gap-[2px]">
          <div className="w-[3px] h-3 bg-black rounded-sm"></div>
          <div className="w-[3px] h-3 bg-black rounded-sm"></div>
          <div className="w-[3px] h-3 bg-black rounded-sm"></div>
          <div className="w-[3px] h-3 bg-black rounded-sm"></div>
        </div>
        <svg width="15" height="11" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
        </svg>
        <div className="w-6 h-3 border-2 border-black rounded-sm relative">
          <div className="absolute right-[-3px] top-[2px] w-[2px] h-2 bg-black rounded-r-sm"></div>
        </div>
      </div>
    </div>
  );
}
