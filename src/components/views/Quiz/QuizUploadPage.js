import React, { Component } from "react";
import axios from "axios";

class QuizUploadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters: [{ value: "" }],
      questions: [
        {
          name: "question",
          question: "",
          options: [
            { name: "a", option: "", isCorrect: true },
            { name: "b", option: "", isCorrect: false },
            { name: "c", option: "", isCorrect: false },
            { name: "d", option: "", isCorrect: false },
          ],
        },
      ],
    };
  }

  componentDidMount() {
    axios.get(`/api/chapter/`).then((res) => {
      const chaptersList = res.data;
      console.log(res.data);
      this.setState({ chapters: chaptersList });
    });
    console.log(this.state.chapters);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let Quiz = {};
    Quiz.quiz = this.state.questions;
    const NewQuiz = {
      chapterid: this.state.chapters.value,
      Quiz,
    };
    axios.post(`/api/quiz/upload-quiz`, NewQuiz).then((res) => {
      if (res.status === 201) {
        alert("Quiz Uploaded Successfully");
        this.props.history.push("/");
      } else {
        alert("Failed to upload Quiz");
      }
    });
    console.log(this.state.chapters.value);
    console.log(this.state.questions);
    console.log(e);
  };

  addQuestion = () => {
    let { questions } = this.state;
    questions.push({
      name: "question_" + this.state.questions.length,
      question: "",
      options: [
        { name: "a", option: "", isCorrect: true },
        { name: "b", option: "", isCorrect: false },
        { name: "c", option: "", isCorrect: false },
        { name: "d", option: "", isCorrect: false },
      ],
    });
    this.setState({ questions });
  };

  render() {
    return (
      <div style={{ padding: "20px", margin: "40px" }}>
        <div className="row border rounded shadow p-2 mb-5">
          <div className="col-sm-6 h3 text-primary">Add Quiz</div>
          <div className="col-sm-6 text-right">
            <button
              type="button"
              className="btn btn-outline-primary mr-2"
              onClick={this.addQuestion}
            >
              Add Question
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={this.handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
        <select
          onChange={(e) => {
            let { chapters } = this.state;
            chapters.value = e.target.value;
            this.setState({ chapters });
            console.log(this.state.chapters);
          }}
        >
          {this.state.chapters.map((chapter) => (
            <option key={chapter._id} value={chapter._id}>
              {chapter.chapterName}
            </option>
          ))}
        </select>
        <div className="col-sm-6 h6 text-primary">
          Write correct answser in option a.
        </div>
        <form onSubmit={this.handleSubmit}>
          {this.state.questions.map((question, index) => (
            <div className="p-1">
              <div className="row shadow rounded" key={index}>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label htmlFor={question.name}>Question {index + 1}</label>
                    <input
                      type="text"
                      className="form-control"
                      id={question.name}
                      placeholder={"Question " + (index + 1)}
                      value={question.question}
                      onChange={(e) => {
                        let { questions } = this.state;
                        question.question = e.target.value;
                        questions[index] = question;
                        this.setState({ questions });
                      }}
                    />
                  </div>
                </div>
                {question.options.map((option, innerIndex) => (
                  <div className="col-sm-6" key={innerIndex + 500000}>
                    <div className="form-group">
                      <label htmlFor={option.name + index}>
                        Option {option.name}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={option.name + index}
                        placeholder={"Option " + option.name}
                        value={option.option}
                        onChange={(e) => {
                          let { questions } = this.state;
                          question.options[innerIndex].option = e.target.value;
                          questions[index] = question;
                          this.setState({ questions });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <hr />
            </div>
          ))}
        </form>
      </div>
    );
  }
}

export default QuizUploadPage;
