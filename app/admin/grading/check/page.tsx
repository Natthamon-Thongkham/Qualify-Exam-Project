"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type StudentInfo = {
  id: string;
  name: string;
  submittedDate: string;
  submittedTime: string;
  totalScore: number;
  
  partStatus: {
    [key: number]: "Reviewed" | "Pending";
  };
};

type QuestionData = {
  title: string;
  questionLabel: string;
  question: string;
  answer: string;
  aiFeedback: string;
  aiPoints: string[];
  suggestedScore: string;
  maxScore: number;
};

type AnswerFromDB = {
  answer_id: string;
  question_id: string;
  question_text: string;
  final_score: string;
  max_score: string;
};

type PartInfo = {
  id: number;
  name: string;
  questionCount: number;
};

const students: Record<string, StudentInfo> = {
  "2310511101110": {
  id: "2310511101110",
  name: "Sara Khan",
  submittedDate: "2026-08-14",
  submittedTime: "16:53",
  totalScore: 16,
  partStatus: {
  1: "Reviewed",
  2: "Reviewed",
  3: "Reviewed",
  4: "Reviewed",
},
},

"2310511101111": {
  id: "2310511101111",
  name: "Ali Ahmed",
  submittedDate: "2026-08-14",
  submittedTime: "16:55",
  totalScore: 12,
  partStatus: {
  1: "Reviewed",
  2: "Reviewed",
  3: "Reviewed",
  4: "Reviewed",
},
},

"2310511101115": {
  id: "2310511101115",
  name: "Nadia Rahman",
  submittedDate: "2026-08-14",
  submittedTime: "17:10",
  totalScore: 44,
  partStatus: {
    1: "Reviewed",
    2: "Reviewed",
    3: "Reviewed",
    4: "Reviewed",
  },
},

"2310511101116": {
  id: "2310511101116",
  name: "Omar Faruk",
  submittedDate: "2026-08-14",
  submittedTime: "17:12",
  totalScore: 68,
  partStatus: {
    1: "Reviewed",
    2: "Reviewed",
    3: "Reviewed",
    4: "Reviewed",
  },
},

"2310511101117": {
  id: "2310511101117",
  name: "Maya Singh",
  submittedDate: "2026-08-14",
  submittedTime: "17:15",
  totalScore: 0,
  partStatus: {
    1: "Pending",
    2: "Pending",
    3: "Pending",
    4: "Pending",
  },
},

"2310511101118": {
  id: "2310511101118",
  name: "Daniel Kim",
  submittedDate: "2026-08-14",
  submittedTime: "17:18",
  totalScore: 72,
  partStatus: {
    1: "Reviewed",
    2: "Reviewed",
    3: "Reviewed",
    4: "Reviewed",
  },
},

"2310511101119": {
  id: "2310511101119",
  name: "Lina Chen",
  submittedDate: "2026-08-14",
  submittedTime: "17:20",
  totalScore: 0,
  partStatus: {
    1: "Pending",
    2: "Pending",
    3: "Pending",
    4: "Pending",
  },
},
};

const parts: PartInfo[] = [
  {
    id: 1,
    name: "Part 1 : Coding Snippet",
    questionCount: 10,
  },
  {
    id: 2,
    name: "Part 2 : Programming",
    questionCount: 1,
  },
  {
    id: 3,
    name: "Part 3",
    questionCount: 3,
  },
  {
    id: 4,
    name: "Part 4",
    questionCount: 1,
  },
];

/*
  ตอนนี้เป็น Mock Data สำหรับ Frontend
  ตอนเชื่อม Backend ภายหลัง เราจะเปลี่ยนส่วนนี้ให้ดึงจาก API/PostgreSQL
*/
const questionData: Record<string, QuestionData> = {
  "1-1": {
    title: "Part 1 : Coding Snippet",
    questionLabel: "Question 1 :",

    question: "Question 1 content will be loaded from the backend.",

    answer: "Student answer will be loaded from the backend.",

    aiFeedback:
      "The student correctly implemented the tax calculation logic according to the given conditions.",

    aiPoints: [
      "Correct parameter and return type",
      "Correct calculation for all CC ranges",
      "Proper use of if-else if-else structure",
    ],

    suggestedScore: "3 / 3",
    maxScore: 5,
  },

  "1-2": {
    title: "Part 1 : Coding Snippet",
    questionLabel: "Question 2 :",

    question: "Question 2 content will be loaded from the backend.",
    answer: "Student answer will be loaded from the backend.",

    aiFeedback:
      "The student correctly implemented the tax calculation logic according to the given conditions.",

    aiPoints: [
      "Correct parameter and return type",
      "Correct calculation for all CC ranges",
      "Proper use of if-else if-else structure",
    ],

    suggestedScore: "3 / 3",
    maxScore: 3,
  },

  "2-1": {
    title: "Part 2 : Programming",
    questionLabel: "Question :",

    question: "Question 1 content will be loaded from the backend.",
    answer: "Student answer will be loaded from the backend.",

    aiFeedback:
      "The student correctly implemented the tax calculation logic according to the given conditions.",

    aiPoints: [
      "Correct parameter and return type",
      "Correct calculation for all CC ranges",
      "Proper use of if-else if-else structure",
    ],

    suggestedScore: "3 / 3",
    maxScore: 25,
  },
};

export default function CheckAnswerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [answersFromDB, setAnswersFromDB] = useState<AnswerFromDB[]>([]);

  useEffect(() => {
  const loadAnswers = async () => {
    try {
      const response = await fetch("/api/answers");

      if (!response.ok) {
        throw new Error("Cannot load answers");
      }

      const data: AnswerFromDB[] = await response.json();

      setAnswersFromDB(data);
    } catch (error) {
      console.error("Error loading answers:", error);
    }
  };

  loadAnswers();
}, []);

  const [fullscreenBox, setFullscreenBox] = useState<
  "question" | "answer" | null
  >(null);

  const studentId =
    searchParams.get("student") ?? "2310511101110";

  const partNumber = Number(searchParams.get("part") ?? "1");
  const questionNumber = Number(
    searchParams.get("question") ?? "1"
  );

  const student =
    students[studentId] ?? students["2310511101110"];

  const currentPart =
    parts.find((part) => part.id === partNumber) ?? parts[0];

  const questionKey = `${partNumber}-${questionNumber}`;

  const answerFromDB = answersFromDB.find(
  (answer) => answer.question_id === String(questionNumber)
  );

  const databaseMaxScore = answerFromDB
  ? Number(answerFromDB.max_score)
  : null;

  /*
    ถ้ายังไม่มี Mock Data ของข้อนั้น
    ให้สร้าง placeholder ไว้ก่อน
  */
  const mockQuestion: QuestionData =
    questionData[questionKey] ?? {
      title: currentPart.name,
      questionLabel: `Question ${questionNumber} :`,

      question: `Question ${questionNumber} content will be loaded from the backend.`,

      answer: "Student answer will be loaded from the backend.",

      aiFeedback:
        "AI assessment will be loaded when grading data is available.",

      aiPoints: [
        "Assessment information",
        "Correctness analysis",
        "Suggested grading result",
      ],

      suggestedScore: "- / -",
      maxScore: answerFromDB
      ? Number(answerFromDB.max_score)
      : 20,
    };

    const currentQuestion: QuestionData = {
      ...mockQuestion,
      maxScore: databaseMaxScore ?? mockQuestion.maxScore,
    };

  const [score, setScore] = useState("");
  const [savedScore, setSavedScore] = useState("");
  const [remark, setRemark] = useState("");

  const [partMenuOpen, setPartMenuOpen] = useState(false);

  const handleScoreChange = (value: string) => {
    const onlyNumber = value.replace(/\D/g, "");

    if (onlyNumber === "") {
      setScore("");
      return;
    }

    const number = Math.min(
      Number(onlyNumber),
      currentQuestion.maxScore
    );

    setScore(String(number));
  };

  const goToPart = (part: number) => {
    setPartMenuOpen(false);

    router.push(
      `/admin/grading/check?student=${studentId}&part=${part}&question=1`
    );
  };

  const goBack = () => {
    /*
      ถ้ายังไม่ใช่ข้อแรกของ Part
      → ย้อนกลับ 1 ข้อ
    */
    if (questionNumber > 1) {
      router.push(
        `/admin/grading/check?student=${studentId}&part=${partNumber}&question=${
          questionNumber - 1
        }`
      );

      return;
    }

    /*
      ถ้าเป็นข้อแรกของ Part และไม่ใช่ Part 1
      → กลับไปข้อสุดท้ายของ Part ก่อนหน้า
    */
    if (partNumber > 1) {
      const previousPart = parts.find(
        (part) => part.id === partNumber - 1
      );

      const previousQuestion =
        previousPart?.questionCount ?? 1;

      router.push(
        `/admin/grading/check?student=${studentId}&part=${
          partNumber - 1
        }&question=${previousQuestion}`
      );
    }
  };

  const goNext = () => {
  // ไปข้อถัดไปเฉพาะภายใน Part เดิมเท่านั้น
  if (questionNumber < currentPart.questionCount) {
    router.push(
      `/admin/grading/check?student=${studentId}&part=${partNumber}&question=${
        questionNumber + 1
      }`
    );
  }
};
const reviewedPartsCount = parts.filter(
  (part) => student.partStatus[part.id] === "Reviewed"
).length;

const totalPartsCount = parts.length;

const backToStudentList = () => {
  const previousPage = searchParams.get("page") || "1";
  router.push(`/admin/grading?page=${previousPage}`);
};

  return (
    <section className="reviewPage">

    <button
      type="button"
      className="backToStudentList"
      onClick={backToStudentList}
    >
      <span className="backArrow">←</span>
      Back to Student List
    </button>

      {/* ========================
          TOP INFORMATION
      ======================== */}

      <div className="reviewTop">
        <div className="examPartsSelector">
          <button
            type="button"
            className="examPartsButton"
            onClick={() =>
              setPartMenuOpen((current) => !current)
            }
          >
            <div>
              <div className="examPartsTitle">
                Exam Parts

                <span
                  className={
                    student.partStatus[currentPart.id] === "Reviewed"
                      ? "smallReviewed"
                      : "smallPending"
                  }
                >
                  {student.partStatus[currentPart.id]}
                </span>
              </div>

              <div className="examPartsName">
                {currentPart.name}
              </div>
            </div>

            <img
              src="/icons/Dropdown Arrow.png"
              alt=""
              className={`partsArrowImage ${
                partMenuOpen ? "partsArrowImageOpen" : ""
              }`}
            />
          </button>

          {partMenuOpen && (
            <div className="examPartsDropdown">
              {parts.map((part) => (
                <button
                  key={part.id}
                  type="button"
                  className={`examPartOption ${
                    partNumber === part.id
                      ? "activeExamPart"
                      : ""
                  }`}
                  onClick={() => goToPart(part.id)}
                >
                  <div>
                    <strong>{part.name}</strong>

                    <span
                      className={
                        student.partStatus[part.id] === "Reviewed"
                          ? "partReviewedText"
                          : "partPendingText"
                      }
                    >
                      {student.partStatus[part.id]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="studentSummary">
          <div className="summaryPersonIcon">
            <img
              src="/icons/users.png"
              alt=""
              className="reviewTopIcon"
            />
          </div>

          <div>
            <strong>{student.name}</strong>
            <span>{student.id}</span>
          </div>
        </div>

        <div className="submittedSummary">
          <div className="calendarIcon">
            <img
              src="/icons/Calendar Check.png"
              alt=""
              className="reviewTopIcon"
            />
          </div>

          <div>
            <strong>Submitted on</strong>

            <span>
              {student.submittedDate}
              &nbsp;&nbsp; 
              <span className="submittedTime">
                <img
                  src="/icons/clock.png"
                  alt=""
                  className="clockIcon"
                />
                {student.submittedTime}
              </span>
            </span>
          </div>
        </div>

        <div className="progressSummary">
          <strong>Progress</strong>

          <span>{reviewedPartsCount}/{totalPartsCount} Parts Reviewed</span>

          <div className="progressTrack">
            <div
              className="progressValue"
              style={{
                width: `${
                  totalPartsCount === 0
                    ? 0
                    : (reviewedPartsCount / totalPartsCount) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="totalSummary">
          <strong>Total Score</strong>

          <span>
            <b>{student.totalScore}</b> / 100
          </span>
        </div>
      </div>

      {/* ========================
          QUESTION + ANSWER
      ======================== */}

      <div className="reviewColumns">
        <div className="reviewLeft">
          <section className="questionBox">
            <div className="boxHeading">
              <h2>{currentQuestion.title}</h2>

              <button
                type="button"
                className="expandButton"
                aria-label="Expand question"
                onClick={() => setFullscreenBox("question")}
              >
                <img
                  src="/icons/fullscreen.png"
                  alt=""
                  className="fullscreenIcon"
                />
              </button>
            </div>

            <div className="questionContent">
              <strong>
                {currentQuestion.questionLabel}
              </strong>

              <pre>
                {currentQuestion.question}
              </pre>
            </div>
          </section>

          <section className="studentAnswerBox">
            <div className="boxHeading">
              <h2>Student Answer</h2>

              <button
                type="button"
                className="expandButton"
                aria-label="Expand student answer"
                onClick={() => setFullscreenBox("answer")}
              >
                ⛶
              </button>
            </div>

            <pre className="studentAnswerText">
              {currentQuestion.answer}
            </pre>
          </section>
        </div>

        {/* ========================
            AI ASSESSMENT
        ======================== */}

        <div className="reviewRight">
          <h2 className="assessmentTitle">
            AI Assessment &amp; Feedback
          </h2>

          <section className="aiAssessment">
            <p>{currentQuestion.aiFeedback}</p>

            <ul>
              {currentQuestion.aiPoints.map(
                (point, index) => (
                  <li key={index}>
                    <span className="checkMark">
                      ✓
                    </span>

                    {point}
                  </li>
                )
              )}
            </ul>

            <div className="suggestedScore">
              <small>Suggested Score</small>

              <div>
                {currentQuestion.suggestedScore}
              </div>
            </div>
          </section>

          {/* ========================
              MANUAL REVIEW
          ======================== */}

          <section className="manualReview">
            <div className="manualLabel">
              <strong>Manual Review</strong>

              <span>
                Score (0-{currentQuestion.maxScore})
              </span>
            </div>

            <div className="manualScore">
              <input
                type="text"
                value={score}
                onChange={(event) =>
                  handleScoreChange(
                    event.target.value
                  )
                }
              />

              <strong>
                / {currentQuestion.maxScore}
              </strong>
            </div>

            <button
              type="button"
              className="cancelScoreButton"
              onClick={() =>
                setScore(savedScore)
              }
            >
              Cancel
            </button>

            <button
              type="button"
              className="saveScoreButton"
              onClick={() =>
                setSavedScore(score)
              }
            >
              Save Score
            </button>
          </section>

          {/* ========================
              REMARK
          ======================== */}

          <section className="remarkSection">
            <strong>Remark (Optional)</strong>

            <textarea
              value={remark}
              maxLength={300}
              onChange={(event) =>
                setRemark(event.target.value)
              }
              placeholder="Add a remark for this Question..."
            />

            <small>
              {remark.length} / 300
            </small>
          </section>
        </div>
      </div>

      {/* ========================
          BACK / NEXT
      ======================== */}

      {(partNumber === 1 || partNumber === 3) && (
        <div className="reviewNavigation reviewNavigationBoth">
          {questionNumber > 1 && (
            <button
              type="button"
              className="backQuestionButton"
              onClick={goBack}
            >
              &lt; Back
            </button>
          )}

          {questionNumber < currentPart.questionCount && (
            <button
              type="button"
              className="nextQuestionButton"
              onClick={goNext}
            >
             Next &gt;
            </button>
          )}
        </div>
      )}
      
      {fullscreenBox && (
        <div
          className="fullscreenOverlay"
          onClick={() => setFullscreenBox(null)}
        >
          <div
            className="fullscreenModal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="fullscreenHeader">
              <h2>
                {fullscreenBox === "question"
                  ? currentQuestion.title
                  : "Student Answer"}
              </h2>

              <button
                type="button"
                className="fullscreenCloseButton"
                onClick={() => setFullscreenBox(null)}
              >
                ✕
              </button>
            </div>

            <div className="fullscreenContent">
              {fullscreenBox === "question" ? (
                <>
                  <strong>
                    {currentQuestion.questionLabel}
                  </strong>

                  <pre>{currentQuestion.question}</pre>
                </>
              ) : (
                <pre>{currentQuestion.answer}</pre>
              )}
            </div>
          </div>
        </div>
      )}

</section>
);
}