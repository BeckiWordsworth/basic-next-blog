"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import classes from "./navbar.module.css";
import person from "../../../public/person.jpg";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleShowDropdown = () => setShowDropdown((prev) => true);
  const handleHideDropdown = () => setShowDropdown((prev) => false);
  const loggedIn = true;
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.left}>
          <Link href="/">Becki Wordsworth</Link>
        </h2>
        <ul className={classes.right}>
          {loggedIn ? (
            <div>
              <Image onClick={handleShowDropdown} src={person} width="45" height="45" />
              {showDropdown && (
                <div className={classes.dropdown}>
                  <AiOutlineClose className={classes.closeIcon} onClick={handleHideDropdown} />
                  <button onClick={handleHideDropdown} className={classes.logout}>
                    Logout
                  </button>
                  <Link href="/create-post" onClick={handleHideDropdown} className={classes.create}>
                    Create
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className={classes.login}>Login</button>
              <Link href="/register">Register</Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;