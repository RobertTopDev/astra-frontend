export default function Unlocks() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="p-8 h-32 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full text-white">
          <div className="text-md ">Private Sale</div>
          <div className="md:text-xl text-md font-medium">
            7% at TGE, 1 month cliff and 2 years vesting with daily unlocks
          </div>
        </div>
      </div>
      <div className="p-8 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex flex-col justify-center h-full text-white">
          <div className="text-md">KOL’s Round</div>
          <div className="md:text-xl text-md font-medium">
            15% at TGE, 1 month cliff and 1.5 years vesting with daily unlocks
          </div>
        </div>
      </div>
    </div>
  )
}
