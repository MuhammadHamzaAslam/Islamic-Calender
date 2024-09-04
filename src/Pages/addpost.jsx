import React, { useState } from "react";
import "../App.css";
import { db, storage } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function AddPost({}) {
  const { month, index } = useParams();
  console.log("Month:", month, "Index:", index);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    location: "",
    description: "",
    picture: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handlePictureChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      picture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.fatherName ||
      !formData.location ||
      !formData.description ||
      !formData.picture
    ) {
      alert("Please fill all fields and upload a picture.");
      return;
    }

    setLoading(true);

    try {
      const storageRef = ref(storage, `images/${formData.picture.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.picture);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(
            "Upload progress: ",
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            "%"
          );
        },
        (error) => {
          console.error("Error uploading picture: ", error);
          alert("Failed to upload picture");
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const collectionRef = collection(db, "uruses");
          await addDoc(collectionRef, {
            name: formData.name,
            fatherName: formData.fatherName,
            location: formData.location,
            description: formData.description,
            pictureURL: downloadURL,
            month: month,
            index: Number(index), // Ensure index is a number
            createdAt: new Date(),
          });

          setFormData({
            name: "",
            fatherName: "",
            location: "",
            description: "",
            picture: null,
          });

          Swal.fire({
            title: "Good job!",
            text: "The Urus Has Been Added",
            icon: "success",
          });

          setLoading(false);
          navigate("/");
        }
      );
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed To Add Urus!",
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <section id="mainSection" className="m-auto">
        <h2>Add Urus</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="fatherName">Father Name</label>
            <input
              type="text"
              id="fatherName"
              placeholder="Enter Father Name"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              placeholder="Enter Location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="picture">Upload Picture</label>
            <input type="file" id="picture" onChange={handlePictureChange} />
          </div>
          <button type="submit" id="submitBtn" disabled={loading}>
            <span>{loading ? "Submitting..." : "Submit"}</span>
          </button>
        </form>
      </section>
    </div>
  );
}

export default AddPost;
