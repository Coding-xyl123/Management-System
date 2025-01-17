import React from "react";
import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        Employee <span className="text-gradient">Management System</span>
      </h1>

      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins">
          Goal: We want to create an employee/HR website portal for managing the
          new employee onboarding process. Employees will be able to update
          personal information, upload required documents for identification and
          work authorization. HR will be able to access employee information and
          make changes regarding the onboarding status.
          <br />
          <br />
          Requirements Coding Backend: Node.js Express server Frontend: React,
          Redux, React-redux, Typescript (optional) 1+ UI component libraries
          (MUI, react-bootstrap, ant design, ...) Any React form library
          (formik, react hook form, react final form,...) Optional: data
          visualization library Your project must make use of reusable
          components, at least for the sections on the employee personal
          information page Database: MongoDB, Mongoose
          <br />
          <br />
          Teams 1. Leads will be in charge of deciding on the project design
          (UI, organizing the project file structure), assigning workloads, and
          making sure everything progresses smoothly. 2. Set up your team’s
          Github repository and add Alex as collaborator 3. The Git repository
          should follow best practices regarding branches, commits, merging,
          pull requests, etc
          <br />
          <br />
          Features Employees HR Login / Navigation Login / Navigation
          Registration Employee Profiles Onboarding Application Visa Status
          Management Personal Information Hiring Management Visa Status
          Managemen
          <br />
          <br />
          For Employees 1. Registration page a. An HR representative must
          generate a registration token and a link to the registration page,
          then send it to a new employee’s email. This is the only way for new
          employees to access the registration page. i. It should be able to
          send an actual email message to a valid email address. Here are some
          options for sending emails: emailjs, nodemailer b. Users must provide
          a unique username, password, and unique email (doesn’t need to be
          real, but should follow the email format like prefix@domain). 2. Login
          page a. Users should provide their username and password to log in,
          after which they are redirected to the Personal Information page. b.
          If they are not logged in, they only have access to the login page.
          Employee Management Project3c. If logged in, users can access the
          entire website. d. If the user has an active session or valid token,
          then after refreshing the page, they should still be logged in.
          <br />
          <br />
          Onboarding Application page a. Onboarding applications can have one of
          three statuses: Pending, Approved, Rejected. b. Users should be
          redirected to this page after they log in, only in the following
          cases: i. Never submitted: they’ll fill in the application fields and
          submit for the first time ii. Rejected: they’ll be able to view
          feedback on why their application was rejected, make changes, and
          resubmit iii. Pending: they’ve submitted the application, so the page
          should say “Please wait for HR to review your application.” They can
          view the submitted application (not editable) and a list of all
          documents that they’ve uploaded They should be able to download each
          document. They should be able to open a preview of the document in the
          browser. iv. If approved, they should be redirected to the home page.
          c. Input fields (bold fields are required, and the rest are optional
          for the user) i. First name, last name, middle name, preferred name
          ii. Profile picture (with a default placeholder) iii. Current address
          (building/apt #, street name, city, state, zip) iv. Cell phone number,
          work phone number v. Email (pre-filled based on email that received
          registration token, cannot be edited) vi. SSN, date of birth, gender
          (male, female, i do not wish to answer) vii. “Permanent resident or
          citizen of the U.S.?” 1. Yes: choose “Green Card” or “Citizen”
          Employee Management Project42. No → “What is your work authorization?”
          (require them to upload files, you can test it with blank pdfs) a.
          H1-B, L2, F1(CPT/OPT), H4, Other b. If F1(CPT/OPT): show an input
          field for uploading their OPT Receipt. c. If other: show an input box
          to specify the visa title d. Start and end date viii. Reference (who
          referred you to this company? There can only be 1) 1. First name, last
          name, middle name, phone, email, relationship 2. Emergency contact(s)
          (1+) a. First name, last name, middle name, phone, email, relationship
          ix. Summary of uploaded files or documents (if applicable) 1. Profile
          picture 2. Driver’s license 3. Work authorization 4. Navigation bar a.
          Personal Information, Visa Status Management, Logout (if logged in) 5.
          Personal Information page (organized into sections) a. The following
          sections should have a button that enables users to edit the fields.
          Clicking the edit button would replace it with a “Cancel” and “Save”
          button. If they click “Cancel”, the website should ask if they want to
          discard all of their changes, and if they click “Yes”, all changes
          should be undone. b. Name i. First name, last name, middle name,
          preferred name ii. Profile picture iii. Email iv. SSN, date of birth,
          gender Employee Management Project5c. Address i. Building/apt #,
          street name, city, state, zip d. Contact Info i. Cell phone number,
          work phone number e. Employment i. Visa title, start date, end date f.
          Emergency contact i. First name, last name, middle name, phone, email,
          relationship g. Documents i. The list of uploaded documents (driver’s
          license, work authorization). ii. They should be able to download each
          document. iii. They should be able to open a preview of the document
          in the browser. 6. Visa Status Management page a. Users should be able
          to manage their work authorization documents. For this project, we’re
          focusing on OPT visas, so the following only applies if the user
          selected OPT for their onboarding application. Otherwise, the page
          should not show any of these documents. This page is used to track the
          status of their uploaded documents and required next steps. b.
          Documents should be uploaded in this order, one by one. Users can only
          upload the next document after the previous document has been approved
          by HR. i. OPT Receipt (submitted in onboarding application, waiting
          for approval) 1. If pending, there should be a message “Waiting for HR
          to approve your OPT Receipt”. 2. If approved, there should be a
          message “Please upload a copy of your OPT EAD”. 3. If rejected, users
          should see HR’s feedback. ii. OPT EAD Employee Management Project61.
          If pending, there should be a message “Waiting for HR to approve your
          OPT EAD“. 2. If approved, there should be a message “Please download
          and fill out the I-983 form”. 3. If rejected, users should see HR’s
          feedback. iii. I-983 1. There should be two documents available for
          download, “Empty Template” and “Sample Template” (can be blank pdfs).
          There must also be a button to upload the filled out form. 2. If
          pending, there should be a message “Waiting for HR to approve and sign
          your I-983“. 3. If approved, there should be a message “Please send
          the I-983 along with all necessary documents to your school and upload
          the new I-20”. 4. If rejected, users should see HR’s feedback. iv.
          I-20 1. If pending, there should be a message “Waiting for HR to
          approve your I-20“. 2. If approved, there should be a message “All
          documents have been approved”. 3. If rejected, users should see HR’s
          feedback. For HR 1. Login page a. This should be exactly the same as
          the employee’s login page. The system should detect whether an account
          is for an employee or HR. i. HR accounts can be hard-coded in the
          database. ii. HR is just an employee with the HR role. 2. Navigation
          bar a. Home, Employee Profiles, Visa Status Management, Hiring
          Management, Logout (if logged in) Employee Management Project73.
          Employee Profiles page a. Allows HR to see a summary of each
          employee’s profile, search for a particular employee, and view their
          entire profile. b. Summary View (list total number of employees, and
          order them alphabetically by last name) i. Name (legal full name) 1.
          The name should be a link that opens a new tab that displays the
          entire profile. ii. SSN iii. Work Authorization Title iv. Phone Number
          v. Email c. Search bar i. Type in the employee’s first name, last
          name, preferred name, and it should display a matching list on every
          key press. ii. Cover all cases for search results: one record found,
          multiple records found, no records found 4. Visa Status Management
          page a. In Progress: Lists all employees who have not yet uploaded and
          been approved for all required OPT documents. It should specify what
          the next step is for that employee. i. Ex: sent registration token:
          next step is to submit onboarding application ii. Ex: submitted OPT
          receipt: next step is to wait for HR approval iii. For each employee:
          1. Name (legal full name) 2. Work Authorization a. Title b. Start and
          end date Employee Management Project8c. Number of Days Remaining 3.
          Next steps 4. Action a. If the next step involves waiting for HR
          approval, show the uploaded document that requires approval. Allow the
          HR to view a preview of that document in the browser. i. HR should be
          able to Approve or Reject the document. If they reject it, they can
          also give feedback. This feedback should be visible to the employee
          when they access their visa status management page. b. If the next
          step involves submitting the next document, show the “Send
          Notification” button. i. This button will send an email to the
          employee as a reminder for their next steps. b. All: Lists all
          visa-status employees. This is for looking at their uploaded
          documents. HR can search to filter for a particular employee. i. For
          each employee: 1. All data in section 1, except the Action category.
          2. All documents that were uploaded & approved. a. HR should be able
          to download each document. b. HR should be able to open a preview of
          the document in the browser. ii. Search bar 1. Type in the employee’s
          first name, last name, preferred name, and it should display a
          matching list on every key press. 2. Cover all cases for search
          results: one record found, multiple records found, no records found 5.
          Hiring Management page Employee Management Project9a. HR should be
          able to generate registration tokens and review onboarding
          applications. b. Registration Token i. A “Generate token and send
          email” button that does what it says; the new employee should receive
          an email with a link. Clicking this link takes them to the
          registration page. ii. The registration token should only be valid for
          3 hours. iii. There should be a history of email addresses that
          received a registration link. It should show the email address,
          person’s name, registration link, and status for whether this email
          address has been submitted in an onboarding application. c. Onboarding
          Application Review i. There should be three sections, one for each
          application status. ii. Pending: HR should be able to view all
          submitted, pending onboarding applications. For each employee: 1. Full
          name 2. Email 3. “View Application” a. When clicked, open a new tab
          that displays the entire form. b. HR should be able to Approve or
          Reject the application. If they reject it, they can also give feedback
          on the application. This feedback should be visible to the employee
          when they access their rejected onboarding application. iii. Rejected:
          HR can view all submitted, rejected applications. Display all the same
          things, except that when clicking “View Application”, they do not have
          the option to give feedback, approve, or reject the application. iv.
          Approved: HR can view all submitted, approved applications. Display
          all the same things, except that when clicking “View Application”,
          they do not have the option to give feedback, approve, or reject the
          application
          <br />
          <br />
          So what are you waiting for? Join the Becodemy family today and
          let&apos;s conquer the programming industry together! With our
          affordable courses, informative videos, and supportive community, the
          sky&apos;s the limit.
        </p>
        <br />
        <span className="text-[22px]">Shahriarsajeeb&apos;s</span>
        <h5 className="text-[18px] font-Poppins">
          Note For any features that involve user input, invalid inputs should
          be appropriately handled, and users should be notified via alerts or
          DOM manipulation. The UI’s design is entirely up to you. Please focus
          on implementing the correct functionality to avoid spending too much
          time on styling. We recommend starting the project in this order: Data
          modeling (entities, relationships, schemas) Set up the MVC-based
          backend structure To implement each page or feature, start with
          backend routing and then connect it to the frontend for that page or
          feature.
        </h5>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
