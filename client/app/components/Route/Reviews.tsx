import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Gene Bates",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "HR Manager | USA",
    comment:
      "Please join me in welcoming Sarah Rodriguez to our Marketing Strategy team! Sarah joins us as a Senior Digital Marketing Specialist with 7 years of experience in brand development and digital campaigns. Prior to joining us, Sarah led successful marketing initiatives at TechGrow Solutions. She's passionate about data-driven marketing and innovative brand storytelling.Welcome aboard, Sarah! We're thrilled to have you on the team.",
  },
  {
    name: "Verna Santos",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "Full stack developer | Brazil",
    comment:
      "🏆 Congratulations to Michael Chen from our Engineering Department! Michael has been recognized for completing his advanced cloud architecture certification. His dedication to continuous learning and professional development exemplifies the growth mindset we value at [Company Name].Michael's commitment to excellence continues to inspire our entire tech team. Keep reaching higher! 🚀 #ProfessionalDevelopment #ContinuousLearning",
  },
  {
    name: "Jay Gibbs",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    profession: "computer systems engineer | Zimbabwe",
    comment:
      "Wellness Matters! 💚This month, we're prioritizing mental health and work-life balance. Our HR team has introduced flexible working hours and monthly wellness workshops to support our employees' holistic well-being.Remember: Your health is your greatest asset. We're here to support you every step of the way. #EmployeeWellness #WorkplaceCulture",
  },
  {
    name: "Mina Davidson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "Junior Web Developer | Indonesia",
    comment:
      "Starting the week strong!  Ready to tackle new challenges and make a difference.  What are your goals for this week?  #MotivationMonday #[CompanyName]",
  },
  {
    name: "Rosemary Smith",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    profession: "Full stack web developer | Algeria",
    comment:
      "First day at [Company Name]! Thrilled to join such an innovative team and start this new chapter in my career. The welcome has been incredible! #NewBeginnings #FirstDay",
  },
  {
    name: "Laura Mckenzie",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    profession: "Full stack web developer | Canada",
    comment:
      "Just wrapped up the [Project Name] after 6 months of hard work! Special shoutout to my amazing team for their dedication and support. #ProjectSuccess #Teamwork",
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image
            src={require("../../../public/assests/business-img.png")}
            alt="business"
            width={700}
            height={700}
          />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Employees Are{" "}
            <span className="text-gradient">Our Strength</span> <br /> Popular
            Posts from Employees Today
          </h3>
          <br />
          <p className={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque unde
            voluptatum dignissimos, nulla perferendis dolorem voluptate nemo
            possimus magni deleniti natus accusamus officiis quasi nihil
            commodi, praesentium quidem, quis doloribus?
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-20px]">
        {reviews &&
          reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
      </div>
    </div>
  );
};

export default Reviews;
