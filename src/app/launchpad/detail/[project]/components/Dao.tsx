export default function Dao() {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      <div className="md:p-8 p-4 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <img
              className="w-10 h-10"
              src="/images/launchpad/lead-vc.png"
              alt="img"
            />
          </div>
          <div className="md:text-left text-center">
            <div className="text-md text-white">Lead VC</div>
            <div className="lg:text-2xl text-lg text-white font-bold">
              Acura Capital
            </div>
          </div>
        </div>
      </div>
      <div className="md:p-8 p-4 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="w-[60px] h-[60px] bg-[#1cdca0] rounded-full flex items-center justify-center">
            <img
              className="w-10 h-10"
              src="/images/launchpad/market-maker.png"
              alt="img"
            />
          </div>
          <div className="md:text-left text-center">
            <div className="text-md text-white">Market Maker</div>
            <div className="lg:text-2xl text-lg text-white font-bold">
              Kairon Labs
            </div>
          </div>
        </div>
      </div>
      <div className="md:p-8 p-4 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <img
              className="w-10 h-10"
              src="/images/launchpad/controlled-cap.svg"
              alt="img"
            />
          </div>
          <div className="md:text-left text-center">
            <div className="text-md text-white">Controlled Cap</div>
            <div className="lg:text-2xl text-lg text-white font-bold">NA</div>
          </div>
        </div>
      </div>
      <div className="md:p-8 p-4 rounded-xl bg-gradient-to-r from-[#636389] to-[#2C2C51] shadow-xl">
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <img
              className="w-10 h-10"
              src="/images/launchpad/dao-approved.svg"
              alt="img"
            />
          </div>
          <div className="md:text-left text-center">
            <div className="text-md text-white">DAO Approved Metrics</div>
            <div className="lg:text-2xl text-lg text-white font-bold">NA</div>
          </div>
        </div>
      </div>
    </div>
  )
}
