import type { NextPage } from 'next'
import Connect from '../components/Connect'

const Home: NextPage = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex justify-center min-h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/5 bt-black bg-nftartokyo"></div>

        <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 bg-[#F4F7FF]">
          <div className="bg-white w-full h-full shadow-md rounded px-4 flex flex-col pt-8">
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              NFT Art Tokyo 来場者用SBT
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-8">
              Polygon Network
            </p>
            <Connect />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
