import React from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "components/SearchForm";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center gap-5 h-full">
      <h1 className="text-5xl">Ask questions and get insights.</h1>
      <SearchForm className="w-1/2" onSearch={(query) => navigate(`/insights?query=${query}`)} />
    </div>
  );
};

export default React.memo(Home);
