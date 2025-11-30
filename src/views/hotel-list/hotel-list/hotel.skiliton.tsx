const HotelSkilton = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <div className="col-12" key={index}>
          <div className="border-top-light pt-30">
            <div className="row x-gap-20 y-gap-20">
              <div className="col-md-auto">
                <div className="cardImage ratio ratio-1:1 w-250 md:w-1/1 rounded-4">
                  <div className="animate-pulse bg-light-2 rounded-4 h-full" />
                  <div className="cardImage__wishlist">
                    <div className="animate-pulse bg-light-2 size-30 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="col-md">
                <div className="animate-pulse bg-light-2 h-20 rounded-2 mb-15 w-3/4" />
                <div className="row x-gap-10 y-gap-10 items-center pt-10">
                  <div className="col-auto">
                    <div className="animate-pulse bg-light-2 h-15 w-200 rounded-2" />
                  </div>
                  <div className="col-auto">
                    <div className="animate-pulse bg-light-2 h-15 w-100 rounded-2" />
                  </div>
                </div>
                <div className="mt-20">
                  <div className="animate-pulse bg-light-2 h-15 w-150 rounded-2" />
                </div>
                <div className="mt-20">
                  <div className="animate-pulse bg-light-2 h-40 rounded-2" />
                </div>
                <div className="row x-gap-10 y-gap-10 pt-20">
                  {[1, 2, 3, 4].map((i) => (
                    <div className="col-auto" key={i}>
                      <div className="animate-pulse bg-light-2 rounded-100 py-5 px-20 h-30" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-auto text-right md:text-left">
                <div className="row x-gap-10 y-gap-10 justify-end items-center md:justify-start">
                  <div className="col-auto">
                    <div className="animate-pulse bg-light-2 h-15 w-100 rounded-2 mb-10" />
                    <div className="animate-pulse bg-light-2 h-15 w-80 rounded-2" />
                  </div>
                  <div className="col-auto">
                    <div className="animate-pulse bg-light-2 size-40 rounded-4" />
                  </div>
                </div>
                <div className="mt-50 md:mt-20">
                  <div className="animate-pulse bg-light-2 h-15 w-150 rounded-2 mb-10" />
                  <div className="animate-pulse bg-light-2 h-15 w-100 rounded-2 mb-24" />
                  <div className="animate-pulse bg-light-2 h-50 w-200 rounded-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default HotelSkilton;
