"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

type AnswerFromDB = {
  answer_id: string;
  question_id: string;
  question_text: string;
  final_score: string;
  max_score: string;
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
  {
  id: "2310511101115",
  name: "Nadia Rahman",
  score: "44/100",
  p1: "20/30",
  p2: "9/20",
  p3: "5/25",
  p4: "10/25",
  proportion: "17.6",
  result: "Fail",
  reviewed: "Reviewed",
  },
  {
  id: "2310511101116",
  name: "Omar Faruk",
  score: "68/100",
  p1: "24/30",
  p2: "14/20",
  p3: "15/25",
  p4: "15/25",
  proportion: "27.2",
  result: "Pass",
  reviewed: "Reviewed",
  },
  {
  id: "2310511101117",
  name: "Maya Singh",
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
  id: "2310511101118",
  name: "Daniel Kim",
  score: "72/100",
  p1: "26/30",
  p2: "15/20",
  p3: "16/25",
  p4: "15/25",
  proportion: "28.8",
  result: "Pass",
  reviewed: "Reviewed",
  },
  {
  id: "2310511101119",
  name: "Lina Chen",
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
  const searchParams = useSearchParams();

  const [answersFromDB, setAnswersFromDB] = useState<AnswerFromDB[]>([]);

  const [selectedExam, setSelectedExam] = useState("Practice Exam");
  const [examMenuOpen, setExamMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [reviewStatus, setReviewStatus] = useState("all");
  const [passFail, setPassFail] = useState("all");

  useEffect(() => {
  const loadAnswers = async () => {
    try {
      const response = await fetch("/api/answers");

      if (!response.ok) {
        throw new Error("Cannot load answers");
      }

      const data: AnswerFromDB[] = await response.json();

      console.log("Answers from PostgreSQL:", data);
      setAnswersFromDB(data);
    } catch (error) {
      console.error("Error loading answers:", error);
    }
  };

  loadAnswers();
}, []);
  
  const [page, setPage] = useState(() => {
  const pageFromUrl = Number(searchParams.get("page"));
  return pageFromUrl > 0 ? pageFromUrl : 1;
  });

  const pendingReviewCount = students.filter(
  (student) => student.reviewed === "Pending"
  ).length;

  const reviewedStudents = students.filter(
  (student) => student.result === "Pass" || student.result === "Fail"
  );

  const passedStudents = reviewedStudents.filter(
  (student) => student.result === "Pass"
  );

  const passRate =
  reviewedStudents.length === 0
    ? 0
    : (passedStudents.length / reviewedStudents.length) * 100;

  const filteredStudents = useMemo(() => {
  const keyword = search.trim().toLowerCase();

  

  return students.filter((student) => {
    const matchSearch =
      keyword === "" ||
      student.id.toLowerCase().includes(keyword) ||
      student.name.toLowerCase().includes(keyword);

    const matchReview =
      reviewStatus === "all" ||
      student.reviewed === reviewStatus;

    const matchResult =
      passFail === "all" ||
      student.result === passFail;

    return matchSearch && matchReview && matchResult;
  });
}, [search, reviewStatus, passFail]);

// แบ่งหน้า
const studentsPerPage = 5;

const totalPages = Math.ceil(
  filteredStudents.length / studentsPerPage
);

const startIndex = (page - 1) * studentsPerPage;
const endIndex = startIndex + studentsPerPage;

const currentStudents = filteredStudents.slice(
  startIndex,
  endIndex
);

  
  const applyFilters = () => {
  setPage(1);
  };

  const resetFilters = () => {
  setSearch("");
  setReviewStatus("all");
  setPassFail("all");
  setPage(1);
  };

  const openStudent = (student: Student) => {
  router.push(
    `/admin/grading/check?student=${student.id}&part=1&question=1&page=${page}`
  );
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
    <div className="summaryIcon documentIcon">
      <img
        src="/icons/File Text.png"
        alt=""
        className="summaryImageIcon"
      />
    </div>

    <div className="examText">
      <strong>Exam Set</strong>
      <span>{selectedExam}</span>
    </div>

    <img
      src="/icons/Dropdown Arrow.png"
      alt=""
      className={`dropdownImageIcon ${
        examMenuOpen ? "dropdownImageOpen" : ""
      }`}
    />
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
        <span className="examOptionIcon">
          <img
            src="/icons/File Text.png"
            alt=""
            className="examOptionImage"
          />
        </span>

        <div>
          <strong className="examOptionTitle">
            Practice Exam
            {selectedExam === "Practice Exam" && (
              <span className="examTitleCheck">✓</span>
            )}
          </strong>

          <div className="examOptionDetails">
            <span className="examDetailItem">
              <img src="/icons/Calendar.png" alt="" />
              2026-08-10
            </span>

            <span className="examDetailItem">
              <img src="/icons/clock.png" alt="" />
              14.30
            </span>

            <span className="examDetailItem">
              <img src="/icons/clock.png" alt="" />
              180 mins
            </span>
          </div>
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
        <span className="examOptionIcon">
          <img
            src="/icons/File Text.png"
            alt=""
            className="examOptionImage"
          />
        </span>

        <div>
          <strong className="examOptionTitle">
            Qualify Exam
            {selectedExam === "Qualify Exam" && (
              <span className="examTitleCheck">✓</span>
            )}
          </strong>

          <div className="examOptionDetails">
            <span className="examDetailItem">
              <img src="/icons/Calendar.png" alt="" />
              2026-08-14
            </span>

            <span className="examDetailItem">
              <img src="/icons/clock.png" alt="" />
              14.30
            </span>

            <span className="examDetailItem">
              <img src="/icons/clock.png" alt="" />
              180 mins
            </span>
          </div>
        </div>
      </button>
    </div>
  )}
</div>

        <div className="summaryCard">
          <div className="summaryIcon studentsIcon">
            <img
              src="/icons/users.png"
              alt=""
              className="summaryImageIcon"
            />
          </div>

          <div>
            <strong>Total Students</strong>
            <span>{students.length}</span>
          </div>
        </div>

        <div className="summaryCard">
          <div className="summaryIcon pendingIcon">
            <img
              src="/icons/testing.png"
              alt=""
              className="summaryImageIcon"
            />
          </div>

          <div>
            <strong>Pending Review</strong>
            <span>{pendingReviewCount}</span>
          </div>
        </div>

        <div className="summaryCard">
          <div className="summaryIcon">
            <img
              src="/icons/Award Trophy.png"
              alt=""
              className="summaryImageIcon"
            />
          </div>

          <div>
            <strong>Pass Rate</strong>
            <span>{passRate.toFixed(2)}%</span>
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
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            <select
              value={reviewStatus}
              onChange={(event) => {
                setReviewStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">Select Reviewed Status</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={passFail}
              onChange={(event) => {
                setPassFail(event.target.value);
                setPage(1);
              }}
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
              {currentStudents.length === 0 && (
                <tr>
                  <td colSpan={10} className="noStudentsFound">
                    No students found
                  </td>
                </tr>
              )}

              {currentStudents.map((student) => (
                <tr
                  key={student.id}
                  className="clickableStudent"
                  onClick={() => openStudent(student)}
                 >
                  <td>
                    <div className="studentId">
                      <span className="avatar">
                        <img
                          src="/icons/user.png"
                          alt=""
                          className="avatarImage"
                        />
                      </span>
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
              Showing{" "}
              {filteredStudents.length === 0 ? 0 : startIndex + 1}
              {" "}to{" "}
              {Math.min(endIndex, filteredStudents.length)}
              {" "}of{" "}
              {filteredStudents.length} students
            </p>

          <div className="pagination">
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              disabled={page === 1}
            >
              ‹
            </button>

            {totalPages <= 5 ? (
              // ถ้ามีไม่เกิน 5 หน้า แสดงทุกหน้า
              Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    type="button"
                    key={pageNumber}
                    className={page === pageNumber ? "currentPage" : ""}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })
            ) : (
              <>
                {/* หน้า 1 */}
                <button
                  type="button"
                  className={page === 1 ? "currentPage" : ""}
                  onClick={() => setPage(1)}
                >
                  1
                </button>

                {/* จุด ... ด้านซ้าย */}
                {page > 3 && (
                  <button type="button" disabled>
                    ...
                  </button>
                )}

                {/* หน้าก่อนหน้า */}
                {page > 2 && (
                  <button
                    type="button"
                    onClick={() => setPage(page - 1)}
                  >
                    {page - 1}
                  </button>
                )}

                {/* หน้าปัจจุบัน */}
                {page !== 1 && page !== totalPages && (
                  <button
                    type="button"
                    className="currentPage"
                    onClick={() => setPage(page)}
                  >
                    {page}
                  </button>
                )}

                {/* หน้าถัดไป */}
                {page < totalPages - 1 && (
                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                  >
                    {page + 1}
                  </button>
                )}

                {/* จุด ... ด้านขวา */}
                {page < totalPages - 2 && (
                  <button type="button" disabled>
                    ...
                  </button>
                )}

                {/* หน้าสุดท้าย */}
                <button
                  type="button"
                  className={page === totalPages ? "currentPage" : ""}
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1)
                )
              }
              disabled={page === totalPages || totalPages === 0}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}