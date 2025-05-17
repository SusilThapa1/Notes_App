const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen-minus-64 ">
      <div className="flex flex-col gap-5 justify-center items-center h-full w-full">
        <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        <h1 className="animate-pulse text-lg font-semibold">Loading...</h1>
      </div>
    </div>
  );
};

export default Loader;
