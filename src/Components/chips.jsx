function Chips({ title, onclick, isSelected }) {
  return (
    <>
      <div
        className={`border-2 border-purple-300 cursor-pointer p-2 text-center rounded-md mx-4 mt-1 ${
          isSelected ? "bg-purple-300" : "hover:bg-purple-200"
        }`}
        onClick={onclick}
      >
        <h2>{title}</h2>
      </div>
    </>
  );
}

export default Chips;
