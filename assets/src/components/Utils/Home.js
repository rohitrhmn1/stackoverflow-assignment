import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Form,
  Card,
  Accordion,
  ListGroup,
} from "react-bootstrap";

import QuestionCard from "utils/QuestionCard";
import axios from "axios";
import Paginator from "./Paginator";
import MessageDismissible from "./MessageDismissible";

/**
 * ✔ q - a free form text parameter, will match all question properties based on an undocumented algorithm.
 * ✔ accepted - true to return only questions with accepted answers, false to return only those without. Omit to elide constraint.
 * ✔ answers - the minimum number of answers returned questions must have.
 * ✔ body - text which must appear in returned questions' bodies.
 * ✔ closed - true to return only closed questions, false to return only open ones. Omit to elide constraint.
 * ✔ migrated - true to return only questions migrated away from a site, false to return only those not. Omit to elide constraint.
 * ✔ notice - true to return only questions with post notices, false to return only those without. Omit to elide constraint.
 * ✔ wiki - true to return only community wiki questions, false to return only non-community wiki ones. Omit to elide constraint.
 * ✔ nottagged - a semicolon delimited list of tags, none of which will be present on returned questions.
 * ✔ tagged - a semicolon delimited list of tags, of which at least one will be present on all returned questions.
 * ✔ title - text which must appear in returned questions' titles.
 * ✔ user - the id of the user who must own the questions returned.
 * ✔ url - a url which must be contained in a post, may include a wildcard.
 * ✔ views - the minimum number of views returned questions must have.
 **/

function Home() {
  let navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  const [query, setQuery] = useState("");
  const [includedOptions, setIncludedOptions] = useState(false);

  const [selectedSortBy, setSelectedSortBy] = useState(null);
  const [selectedOrderBy, setSelectedOrderBy] = useState(null);

  const [answers, setAnswers] = useState(0);
  const [views, setViews] = useState(0);

  const [closed, setClosed] = useState(null);
  const [migrated, setMigrated] = useState(null);
  const [notice, setNotice] = useState(null);
  const [wiki, setWiki] = useState(null);

  const [tagged, setTagged] = useState("");
  const [nottagged, setNottagged] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");

  const [responseData, setResponseData] = useState([]);
  const [responseDetail, setResponseDetail] = useState(null);
  const [responseSuccess, setResponseSuccess] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const sortByOptions = [
    { name: "Activity", value: "activity" },
    { name: "Creation", value: "creation" },
    { name: "Votes", value: "votes" },
    { name: "Relevance", value: "relevance" },
  ];

  const orderByOptions = [
    { name: "Descending", value: "desc" },
    { name: "Ascending", value: "asc" },
  ];

  const radioOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
    { label: "All", value: undefined },
  ];

  async function submitSearch(formData) {
    try {
      const response = await axios.post("/api/search/", formData);

      console.log("RESPONSE SUBMITTED");
      const { success, detail, data, count } = response.data;

      setResponseSuccess(success);
      setResponseDetail(detail);

      setResponseData(data);
      setTotal(count);
      setShowMessage(true);
    } catch (error) {
      setResponseSuccess(false);
      setResponseDetail(error.response.data.detail);
      setShowMessage(true);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    var data = {
      q: query,
      page: page,
    };

    answers != 0 && (data["answers"] = answers);
    views != 0 && (data["views"] = views);

    title && (data["title"] = title);
    user && (data["user"] = user);
    url && (data["url"] = url);
    body && (data["body"] = body);

    fromDate && (data["from_date"] = fromDate);
    toDate && (data["to_date"] = toDate);
    tagged && (data["tagged"] = tagged);
    nottagged && (data["nottagged"] = nottagged);

    closed && (data["closed"] = closed);
    migrated && (data["migrated"] = migrated);
    notice && (data["notice"] = notice);
    wiki && (data["wiki"] = wiki);

    selectedOrderBy && (data["order_by"] = selectedOrderBy);
    selectedSortBy && (data["sort_by"] = selectedSortBy);

    console.log("Form action submitted with data=", data);
    const searchParms = new URLSearchParams(data).toString();
    console.log("CURRENT DATA =====>", data);
    console.log("EDITED DATA =====>", { ...data, page: 2 });
    console.log(searchParms);
    navigate(`/?${searchParms}`);

    submitSearch(data);
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const filled_data = Object.fromEntries(urlSearchParams.entries());
    if (Object.keys(filled_data).length) {
      submitSearch(filled_data);
      setPage(filled_data.page);
    }
  }, [window.location.search]);

  return (
    <Container fluid="md" className="mb-3">
      {showMessage && (
        <Row className="my-3">
          <MessageDismissible
            variant={responseSuccess ? "success" : "danger"}
            onClose={() => setShowMessage(false)}
          >
            {responseDetail}
          </MessageDismissible>
        </Row>
      )}
      <Row>
        <Col>
          <p className="text-center fs-1 fw-bold ">
            Search your questions on Stack Overflow
          </p>
        </Col>
      </Row>
      <Form method="GET" onSubmit={handleSearch} className="mb-3">
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search any question in stack overflow"
                aria-label="Search box"
                aria-describedby="search-box"
                onChange={(e) => setQuery(e.target.value)}
                required
              />
              <Button
                variant="outline-warning"
                id="search-button"
                type="submit"
              >
                Search
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Container>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Advanced search options</Accordion.Header>
                <Accordion.Body>
                  <Row className="mb-3">
                    <Form.Group as={Col} sm={4} controlId="id_order_by">
                      <Form.Label>Order</Form.Label>
                      <Form.Select
                        defaultValue={orderByOptions[0].value}
                        onChange={(e) => setSelectedOrderBy(e.target.value)}
                      >
                        {orderByOptions.map((item, index) => (
                          <option key={index} value={item.value}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} sm={4} controlId="id_sort_by">
                      <Form.Label>Sort</Form.Label>
                      <Form.Select
                        defaultValue={sortByOptions[0].value}
                        onChange={(e) => setSelectedSortBy(e.target.value)}
                      >
                        {sortByOptions.map((item, index) => (
                          <option key={index} value={item.value}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={4} className="mb-3">
                      <Form.Label>Filter by user id</Form.Label>
                      <Form.Control
                        placeholder="Filter by user id"
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} sm={6} controlId="id_from_date">
                      <Form.Label>From date</Form.Label>
                      <Form.Control
                        type="date"
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={6} controlId="id_to_date">
                      <Form.Label>To date</Form.Label>
                      <Form.Control
                        type="date"
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </Form.Group>
                  </Row>
                  <Form.Group className="mb-3" controlId="id_title">
                    <Form.Label>Contains title</Form.Label>
                    <Form.Control
                      placeholder="A text which must appear in returned questions' titles"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="id_url">
                    <Form.Label>Contains URL</Form.Label>
                    <Form.Control
                      placeholder="A url which must be contained in a post, may include a wildcard"
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="id_body_text">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Some text which must appear in returned questions' bodies"
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Form.Group as={Col} sm={6} controlId="id_num_ans">
                      <Form.Label>Minimum number of answers</Form.Label>
                      <Form.Control
                        type="number"
                        min={"0"}
                        defaultValue={"0"}
                        onChange={(e) => setAnswers(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={6} controlId="id_num_views">
                      <Form.Label>Minimum number of Views</Form.Label>
                      <Form.Control
                        type="number"
                        min={"0"}
                        defaultValue={"0"}
                        onChange={(e) => setViews(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Enter tags to include</Form.Label>
                    <Form.Control
                      placeholder="Enter tags separated by semicolon"
                      onChange={(e) => setTagged(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Enter tags to exclude</Form.Label>
                    <Form.Control
                      placeholder="Enter tags separated by semicolon"
                      onChange={(e) => setNottagged(e.target.value)}
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formClosedOption">
                      <Form.Check
                        type="checkbox"
                        label="Include these options"
                        onChange={(e) =>
                          e.target.checked
                            ? setIncludedOptions(true)
                            : setIncludedOptions(false)
                        }
                      />
                    </Form.Group>

                    <fieldset disabled={!includedOptions}>
                      <ListGroup as="ul" horizontal={"lg"}>
                        <ListGroup.Item
                          as="li"
                          variant="secondary"
                          className="flex-fill"
                        >
                          <Form.Group>
                            <Form.Label as="p">Include closed: </Form.Label>
                            {radioOptions.map((item, index) => (
                              <Form.Check
                                key={index}
                                inline
                                label={item.label}
                                name="closedOption"
                                type="radio"
                                value={item.value}
                                defaultChecked={item.value == undefined}
                                onChange={(e) => {
                                  console.log(e.target.value);
                                  setClosed(e.target.value);
                                }}
                              />
                            ))}
                          </Form.Group>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          variant="success"
                          className="flex-fill"
                        >
                          <Form.Group>
                            <Form.Label as="p">Include migrated: </Form.Label>
                            {radioOptions.map((item, index) => (
                              <Form.Check
                                key={index}
                                inline
                                label={item.label}
                                name="migratedOption"
                                type="radio"
                                value={item.value}
                                defaultChecked={item.value == undefined}
                                onChange={(e) => setMigrated(e.target.value)}
                              />
                            ))}
                          </Form.Group>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          variant="info"
                          className="flex-fill"
                        >
                          <Form.Group>
                            <Form.Label as="p">Include notice: </Form.Label>
                            {radioOptions.map((item, index) => (
                              <Form.Check
                                key={index}
                                inline
                                label={item.label}
                                name="noticeOption"
                                type="radio"
                                value={item.value}
                                defaultChecked={item.value == undefined}
                                onChange={(e) => setNotice(e.target.value)}
                              />
                            ))}
                          </Form.Group>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          variant="light"
                          className="flex-fill"
                        >
                          <Form.Group>
                            <Form.Label as="p">Include wiki: </Form.Label>
                            {radioOptions.map((item, index) => (
                              <Form.Check
                                key={index}
                                inline
                                label={item.label}
                                name="wikiOption"
                                type="radio"
                                value={item.value}
                                defaultChecked={item.value == undefined}
                                onChange={(e) => setWiki(e.target.value)}
                              />
                            ))}
                          </Form.Group>
                        </ListGroup.Item>
                      </ListGroup>
                    </fieldset>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Container>
        </Row>
      </Form>

      {!!responseData.length && (
        <Row className="mb-3">
          {responseData.map((question, index) => (
            <QuestionCard question={question} key={index} />
          ))}
          <Paginator page={page} pages={25} />
        </Row>
      )}
    </Container>
  );
}

export default Home;
