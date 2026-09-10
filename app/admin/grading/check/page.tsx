"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckAnswerPage() {
  const router = useRouter();

  const [score, setScore] = useState("15");
  const [savedScore, setSavedScore] = useState("15");
  const [remark, setRemark] = useState("");

  const handleScoreChange = (value: string) => {
    const numberOnly = value.replace(/\D/g, "");

    if (numberOnly === "") {
      setScore("");
      return;
    }

    const number = Math.min(Number(numberOnly), 20);

    setScore(String(number));
  };

  const handleSaveScore = () => {
    setSavedScore(score);
  };

  const handleCancelScore = () => {
    setScore(savedScore);
  };

  return (
    <section className="reviewPage">
      {/* =========================
          TOP INFORMATION
      ========================== */}

      <div className="reviewTop">
        <button className="examPartsButton">
          <div>
            <div className="examPartsTitle">
              Exam Parts

              <span className="smallReviewed">
                Reviewed
              </span>
            </div>

            <div className="examPartsName">
              Part 1 : Coding Snippet
            </div>
          </div>

          <span className="partsArrow">▼</span>
        </button>

        <div className="studentSummary">
          <div className="summaryPersonIcon">
            ♙
          </div>

          <div>
            <strong>Sara Khan</strong>
            <span>2310511101110</span>
          </div>
        </div>

        <div className="submittedSummary">
          <div className="calendarIcon">
            ▦
          </div>

          <div>
            <strong>Submitted on</strong>

            <span>
              2026-08-14&nbsp;&nbsp; ◷ 16:53
            </span>
          </div>
        </div>

        <div className="progressSummary">
          <strong>Progress</strong>

          <span>2/4 Parts Reviewed</span>

          <div className="progressTrack">
            <div className="progressValue" />
          </div>
        </div>

        <div className="totalSummary">
          <strong>Total Score</strong>

          <span>
            <b>16</b> / 100
          </span>
        </div>
      </div>

      {/* =========================
          CONTENT
      ========================== */}

      <div className="reviewColumns">
        {/* LEFT */}

        <div className="reviewLeft">
          <section className="questionBox">
            <div className="boxHeading">
              <h2>Part 1 : Coding Snippet</h2>

              <button
                type="button"
                className="expandButton"
                aria-label="Expand question"
              >
                ⛶
              </button>
            </div>

            <div className="questionContent">
              <strong>Question 1 :</strong>

              <pre>{`let newCar = true;
let oldDriver = true;
if (!newCar || oldDriver) {
    console.log("You will go slowly");
} else {
    console. 10g("You will go fast");
}`}</pre>
            </div>
          </section>

          <section className="studentAnswerBox">
            <div className="boxHeading">
              <h2>Student Answer</h2>

              <button
                type="button"
                className="expandButton"
                aria-label="Expand student answer"
              >
                ⛶
              </button>
            </div>

            <p className="studentAnswerText">
              You will go slowly
            </p>
          </section>
        </div>

        {/* RIGHT */}

        <div className="reviewRight">
          <h2 className="assessmentTitle">
            AI Assessment &amp; Feedback
          </h2>

          <section className="aiAssessment">
            <p>
              The student correctly implemented the tax
              calculation logic according to the given
              conditions.
            </p>

            <ul>
              <li>
                <span className="checkMark">✓</span>
                Correct parameter and return type
              </li>

              <li>
                <span className="checkMark">✓</span>
                Correct calculation for all CC ranges
              </li>

              <li>
                <span className="checkMark">✓</span>
                Proper use of if-else if-else structure
              </li>
            </ul>

            <div className="suggestedScore">
              <small>Suggested Score</small>

              <div>3 / 3</div>
            </div>
          </section>

          {/* MANUAL REVIEW */}

          <section className="manualReview">
            <div className="manualLabel">
              <strong>Manual Review</strong>
              <span>Score (0-20)</span>
            </div>

            <div className="manualScore">
              <input
                type="text"
                value={score}
                onChange={(event) =>
                  handleScoreChange(event.target.value)
                }
              />

              <strong>/ 20</strong>
            </div>

            <button
              type="button"
              className="cancelScoreButton"
              onClick={handleCancelScore}
            >
              Cancel
            </button>

            <button
              type="button"
              className="saveScoreButton"
              onClick={handleSaveScore}
            >
              Save Score
            </button>
          </section>

          {/* REMARK */}

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

      {/* =========================
          NEXT
      ========================== */}

      <div className="reviewNavigation">
        <button
          type="button"
          className="nextQuestionButton"
          onClick={() =>
            router.push(
              "/admin/grading/check/p1-2"
            )
          }
        >
          Next &gt;
        </button>
      </div>
    </section>
  );
}