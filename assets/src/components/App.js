import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "utils/Header";
import Home from "utils/Home";
import NotFound from "utils/NotFound";

export default class Homepage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
