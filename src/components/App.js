import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import UploadVideoPage from "./views/Video/UploadVideoPage";
import QuizUploadPage from "./views/Quiz/QuizUploadPage";
import QuizEdit from "./views/Quiz/QuizEdit";
//import VideoDeleteComponent from "./views/Video/VideoDeleteComponent";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "75px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, true)} />
          <Route
            exact
            path="/video/upload"
            component={Auth(UploadVideoPage, true)}
          />
          <Route
            exact
            path="/quiz/upload"
            component={Auth(QuizUploadPage, true)}
          />
          <Route exact path="/quiz/edit" component={Auth(QuizEdit, true)} />
          {/* <Route
            exact
            path="/video/delete"
            component={Auth(VideoDeleteComponent, true)}
          /> */}
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
