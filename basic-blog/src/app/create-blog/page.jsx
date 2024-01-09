"use client";

import React from "react";
import classes from "./createBlog.module.css";
import { AiOutlineFileImage } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CreateBlog = () => {
  const CLOUD_NAME = "dzt4lxguf";
  const UPLOAD_PRESET = "basic_blog_next";

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhot] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading ....</p>;
  }

  if (status === "unauthenticated") {
    return <p className={classes.accessDenied}>Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo || !title || !category || !desc) {
      toast.error("All fields are required");
      return;
    }

    try {
      const imageUrl = await uploadImage();
      const res = await fetch(`http://localhost:3000/api/blog`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({ title, desc, category, imageUrl, authorId: session?.user?._id }),
      });

      if (!res.ok) {
        throw new Error("Error occured");
      }

      const blog = await res.json();
      router.push(`/blog/${blog?._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    if (!photo) return;

    const formData = new FormData();

    formData.append("file", photo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data["secure_url"];
      return imageUrl;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.containter}>
      <div className={classes.wrapper}>
        <h2>Create Post</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title...." onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Description...." />
          <select value={category} onCHnage={(e) => setCategory(e.target.value)}>
            <option value="Nature">Nature</option>
            <option value="Mountain">Mountain</option>
            <option value="Ocean">Ocean</option>
            <option value="Wildfire">Wildfire</option>
            <option value="Forest">Forest</option>
          </select>
          <label htmlFor="image">
            Upload Image <AiOutlineFileImage />
          </label>
          <input id="image" type="file" style={{ display: "none" }} onChange={(e) => setPhoto(e.target.files[0])} />
          <button className={classes.CreateBlog}>Create</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateBlog;
