"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Student = {
  id: string;
  name: string;
  score: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  proportion: string;
  result: "Pass" | "Fail" | "-";
  reviewed: "Reviewed" | "Pending";
};

const students: Student[] = [
  {
    id: "2310511101110",
    name: "Sara Khan",
    score: "16/100",
    p1: "13/30",
    p2: "3/20",
    p3: "0/25",
    p4: "0/25",
    proportion: "6.4",
    result: "Fail",
    reviewed: "Reviewed",
  },
  {
    id: "2310511101111",
    name: "Ali Ahmed",
    score: "12/100",
    p1: "12/30",
    p2: "0/20",
    p3: "0/25",
    p4: "0/25",
    proportion: "4.8",
    result: "Fail",
    reviewed: "Reviewed",
  },
  {
    id: "2310511101112",
    name: "Fatima Noor",
    score: "56/100",
    p1: "28/30",
    p2: "13/20",
    p3: "0/25",
    p4: "15/25",
    proportion: "22.4",
    result: "Pass",
    reviewed: "Reviewed",
  },
  {
    id: "2310511101113",
    name: "Hassan Ali",
    score: "-/100",
    p1: "-/30",
    p2: "-/20",
    p3: "-/25",
    p4: "-/25",
    proportion: "-",
    result: "-",
    reviewed: "Pending",
  },
  {
    id: "2310511101114",
    name: "Hassan Ali",
    score: "-/100",
    p1: "-/30",
    p2: "-/20",
    p3: "-/25",
    p4: "-/25",
    proportion: "-",
    result: "-",
    reviewed: "Pending",
  },
];

export default function GradingPage() {
  const router = useRouter();

  const [selectedExam, setSelectedExam] = useState("Practice Exam");
  const [examMenuOpen, setExamMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [reviewStatus, setReviewStatus] = useState("all");
  const [passFail, setPassFail] = useState("all");

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedReviewStatus, setAppliedReviewStatus] = useState("all");
  const [appliedPassFail, setAppliedPassFail] = useState("all");

  const [page, setPage] = useState(1);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const keyword = appliedSearch.toLowerCase().trim();

      const matchSearch =
        keyword === "" ||
        student.id.includes(keyword) ||
        student.name.toLowerCase().includes(keyword);

      const matchReview =
        appliedReviewStatus === "all" ||
        student.reviewed === appliedReviewStatus;

      const matchResult =
        appliedPassFail === "all" ||
        student.result === appliedPassFail;

      return matchSearch && matchReview && matchResult;
    });
  }, [appliedSearch, appliedReviewStatus, appliedPassFail]);

  const applyFilters = () => {
    setAppliedSearch(search);
    setAppliedReviewStatus(reviewStatus);
    setAppliedPassFail(passFail);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setReviewStatus("all");
    setPassFail("all");

    setAppliedSearch("");
    setAppliedReviewStatus("all");
    setAppliedPassFail("all");

    setPage(1);
  };

  const openStudent = (student: Student) => {
  router.push(`/admin/grading/check?student=${student.id}`);
};

  return (
    <section className="gradingPage">
      <div className="summaryRow">
        <div className="examSelector">
  <button
    type="button"
    className="examSet"
    onClick={() => setExamMenuOpen((current) => !current)}
  >
    <div className="summaryIcon documentIcon">▤</div>

    <div className="examText">
      <strong>Exam Set</strong>
      <span>{selectedExam}</span>
    </div>

    <span className={`arrow ${examMenuOpen ? "arrowOpen" : ""}`}>
      ▼
    </span>
  </button>

  {examMenuOpen && (
    <div className="examDropdown">
      <button
        type="button"
        className={`examOption ${
          selectedExam === "Practice Exam"
            ? "selectedExamOption"
            : ""
        }`}
        onClick={() => {
          setSelectedExam("Practice Exam");
          setExamMenuOpen(false);
        }}
      >
        <span className="examOptionIcon">▤</span>

        <div>
          <strong>Practice Exam</strong>
          <span>2026-08-10 · 14.30 · 180 mins</span>
        </div>
      </button>

      <button
        type="button"
        className={`examOption ${
          selectedExam === "Qualify Exam"
            ? "selectedExamOption"
            : ""
        }`}
        onClick={() => {
          setSelectedExam("Qualify Exam");
          setExamMenuOpen(false);
        }}
      >
        <span className="examOptionIcon">▤</span>

        <div>
          <strong>Qualify Exam</strong>
          <span>2026-08-14 · 14.30 · 180 mins</span>
        </div>
      </button>
    </div>
  )}
</div>

        <div className="summaryCard">
          <div className="summaryIcon studentsIcon">♙</div>

          <div>
            <strong>Total Students</strong>
            <span>32</span>
          </div>
        </div>

        <div className="summaryCard">
          <div className="summaryIcon pendingIcon">📝</div>

          <div>
            <strong>Pending Review</strong>
            <span>8</span>
          </div>
        </div>

        <div className="summaryCard">
          <div className="summaryIcon trophyIcon">🏆</div>

          <div>
            <strong>Pass Rate</strong>
            <span>45.50%</span>
          </div>
        </div>
      </div>

      <div className="studentPanel">
        <div className="studentToolbar">
          <h2>List of Students</h2>

          <div className="filterGroup">
            <div className="searchBox">
              <span className="searchIcon">⌕</span>

              <input
                type="text"
                placeholder="Search by ID or Name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={reviewStatus}
              onChange={(event) => setReviewStatus(event.target.value)}
            >
              <option value="all">Select Reviewed Status</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={passFail}
              onChange={(event) => setPassFail(event.target.value)}
            >
              <option value="all">Select Pass/Fail</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>

            <button className="resetBtn" onClick={resetFilters}>
              Reset
            </button>

            <button className="applyBtn" onClick={applyFilters}>
              Apply
            </button>
          </div>
        </div>

        <div className="tableWrapper">
          <table className="studentTable">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name - Surname</th>
                <th>Score</th>
                <th>P1</th>
                <th>P2</th>
                <th>P3</th>
                <th>P4</th>
                <th>Proportion 40%</th>
                <th>Pass/Fail</th>
                <th>Reviewed Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr
                    key={student.id}
                    className="clickableStudent"
                    onClick={() => openStudent(student)}
                >
                  <td>
                    <div className="studentId">
                      <span className="avatar">♙</span>
                      <span>{student.id}</span>
                    </div>
                  </td>

                  <td>{student.name}</td>
                  <td>{student.score}</td>
                  <td>{student.p1}</td>
                  <td>{student.p2}</td>
                  <td>{student.p3}</td>
                  <td>{student.p4}</td>
                  <td>{student.proportion}</td>
                  <td>{student.result}</td>

                  <td>
                    <span
                      className={
                        student.reviewed === "Reviewed"
                          ? "reviewedBadge"
                          : "pendingBadge"
                      }
                    >
                      {student.reviewed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tableFooter">
          <p>
            Showing 1 to {filteredStudents.length} of 63 students
          </p>

          <div className="pagination">
            <button
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              ‹
            </button>

            <button
              className={page === 1 ? "currentPage" : ""}
              onClick={() => setPage(1)}
            >
              1
            </button>

            <button
              className={page === 2 ? "currentPage" : ""}
              onClick={() => setPage(2)}
            >
              2
            </button>

            <button>...</button>

            <button
              className={page === 8 ? "currentPage" : ""}
              onClick={() => setPage(8)}
            >
              8
            </button>

            <button
              onClick={() =>
                setPage((current) => Math.min(8, current + 1))
              }
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}