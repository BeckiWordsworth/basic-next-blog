import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import classes from "./blogCard.module.css";
import { useSession } from "next-auth/react";

const BlogCard = ({ blog: { _id, title, desc, imageUrl, createdAt, likes, authorId } }) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);

  useEffect(() => {
    session && likes && setIsLiked(likes.includes(session?.user?._id));
    session && likes && setBlogLikes(likes.length);
  }, [likes, session]);

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/blog/${_id}/like`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "PUT",
      });

      console.log(res);
      if (res.ok) {
        if (isLiked) {
          setIsLiked((prev) => !prev);
          setBlogLikes((prev) => prev - 1);
        } else {
          setIsLiked((prev) => !prev);
          setBlogLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Link className={classes.imgContainer} href={`/blog/${_id}`}>
          <Image src={imageUrl} width="350" height="350" />
        </Link>
        <div className={classes.blogData}>
          <div className={classes.left}>
            <h3>{title}</h3>
            <p>{desc}</p>
            <span>
              Created On:<span>{new Date(createdAt).toDateString()}</span>
            </span>
          </div>
          <div className={classes.right}>
            {blogLikes}
            {isLiked ? <AiFillLike onClick={handleLike} size={20} /> : <AiOutlineLike onClick={handleLike} size={20} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
