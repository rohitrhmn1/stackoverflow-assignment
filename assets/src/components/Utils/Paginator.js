import React from "react";
import Pagination from "react-bootstrap/Pagination";
import { Link, useNavigate } from "react-router-dom";

function Paginator({ page = 1, pages }) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const filled_data = Object.fromEntries(urlSearchParams.entries());

  const getPaginationGroup = (currentPage) => {
    let start = Math.floor((Number(currentPage) - 1) / 5) * 5;
    return new Array(5).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <Pagination>
      <li className={`page-item${page <= 1 ? " disabled" : ""}`}>
        <Link
          className="page-link"
          to={`/?${new URLSearchParams({
            ...filled_data,
            page: Number(page) - 1,
          })}`}
        >
          Previous
        </Link>
      </li>
      {/* <li className="page-item">
        <Link
          className="page-link"
          to={`/?${new URLSearchParams({ ...filled_data, page: 1 })}`}
        >
          1
        </Link>
      </li> */}

      {getPaginationGroup(page).map((item, index) => (
        <li
          className={`page-item${Number(page) == item ? " active" : ""}`}
          key={index}
        >
          <Link
            className="page-link"
            to={`/?${new URLSearchParams({ ...filled_data, page: item })}`}
          >
            {item}
          </Link>
        </li>
      ))}

      {/* <li className="page-item">
        <Link className="page-link" to={"#"}>
          3
        </Link>
      </li> */}
      <li className={`page-item${page == 25 ? " disabled" : ""}`}>
        <Link
          className="page-link"
          to={`/?${new URLSearchParams({
            ...filled_data,
            page: Number(page) + 1,
          })}`}
        >
          Next
        </Link>
      </li>
    </Pagination>
  );
}
export default Paginator;
