import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Team.css";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

export default function Team() {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    axios.get("/team").then((res) => {
      console.log("Fetched team:", res.data);
      setMembers(res.data);
    });
  }, []);

  return (
    <section className="team-section">
      <h2 className="team-header">Meet Our Team</h2>
      <p className="team-subtext">
        Our diverse team of skilled photographers brings unique perspectives and
        expertise to capture the essence of your cultural wedding ceremony.
      </p>
      <br />
      <div className="team-list">
        {members.map((member, index) => (
          <div
            key={member._id}
            className={`team-row ${
              index % 2 === 0 ? "row-normal" : "row-reverse"
            }`}
          >
            <img
              src={`http://localhost:5000${member.imageUrl}`}
              alt={member.name}
              className="team-photo"
            />
            <div className="team-details">
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>

              <div className="social-icons">
                {member.socials?.instagram && (
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaInstagram />
                  </a>
                )}
                {member.socials?.facebook && (
                  <a
                    href={member.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaFacebookF />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
