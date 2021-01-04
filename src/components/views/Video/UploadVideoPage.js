import React, { useState, useEffect } from "react";
import { Typography, Button, Form, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

function UploadVideoPage(props) {
  const user = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Chapters, setChapters] = useState({
    selectedChapter: "",
    chaptersList: [],
  });
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [Thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    axios.get(`/api/chapter/`).then((res) => {
      console.log(res.data);
      setChapters({ ...Chapters, chaptersList: res.data });
    });
    console.log(Chapters);
  }, []);

  const handleChangeTitle = (event) => {
    setTitle(event.currentTarget.value);
  };

  const handleChangeDecsription = (event) => {
    setDescription(event.currentTarget.value);
  };

  const handleChangeTwo = (event) => {
    console.log(event.currentTarget.value);
    setChapters({ ...Chapters, selectedChapter: event.currentTarget.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (user.userData && !user.userData.isAuth) {
      return alert("Please Log in First");
    }

    if (
      title === "" ||
      Description === "" ||
      Chapters === "" ||
      FilePath === "" ||
      Duration === "" ||
      Thumbnail === ""
    ) {
      return alert("Please first fill all the fields");
    }

    let variables = {
      writer: user.userData._id,
      title: title,
      description: Description,
      filePath: FilePath,
      duration: Duration,
      thumbnail: Thumbnail,
    };
    console.log(Chapters);
    const data = { chapterid: Chapters.selectedChapter, variables };
    console.log(data.chapterid);

    axios.post("/api/video/uploadVideo", data).then((response) => {
      if (response.data.success) {
        alert("Video uploaded successfully");
        props.history.push("/");
      } else {
        alert("Failed to upload video");
      }
    });
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    console.log(files);
    formData.append("file", files[0]);

    axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        let variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName,
        };
        setFilePath(response.data.filePath);

        //gerenate thumbnail with this filepath !

        axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnail(response.data.thumbsFilePath);
          } else {
            alert("Failed to make the thumbnails");
          }
        });
      } else {
        alert("failed to save the video in server");
      }
    });
  };
  console.log(Chapters.selectedChapter);
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>

          {Thumbnail !== "" && (
            <div>
              <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
            </div>
          )}
        </div>

        <br />
        <br />
        <label>Topic</label>
        <Input onChange={handleChangeTitle} value={title} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={handleChangeDecsription} value={Description} />
        <br />
        <br />
        <select onChange={handleChangeTwo}>
          <option value=""> Select Chapter Name</option>
          {Chapters.chaptersList.map((chapter) => (
            <option key={chapter._id} value={chapter._id}>
              {chapter.chapterName}
            </option>
          ))}
        </select>
        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadVideoPage;
