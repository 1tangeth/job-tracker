
import { useEffect, useState } from 'react';
import FormField from '../components/FormField';
import { useNavigate } from 'react-router-dom';

type job = {id:string, company: string, position : string , url : string , tags: string[]};

function ApplicationPage() {

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [jobText, setJobText] = useState("");
    const [parsing, setParsing] = useState(false);
    const [parsingJob, setParsingJob] = useState(false);
    const [jobs, setJobs] = useState<job[]> ([]);

    const token = localStorage.getItem("token");


    type Application = {
        id: string,
        company: string,
        role: string,
        status: string,
        notes: string
    }
    const [applications, setApplications] = useState<Application[]>([]);

    const [appError, setAppError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token)
            navigate("/signin")
    } , []); // [] means only run once for this page

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/signin");
    }

    async function submitApp() {
        const response = await fetch("http://localhost:3000/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ company, role, status, notes }),
        });
        const data = await response.json();// TODO: what is the value i return here app  }
        if (!response.ok) {
            setAppError(data.error || "Something went wrong");
            return;
        }
        getApp();
    }

    async function getApp() {
        const response = await fetch("http://localhost:3000/applications", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        const body = await response.json();
        if (!response.ok) {
            setAppError(body.error || "Something went wrong");
            return;
        }
        setApplications(body.data);

    }

    async function deleteApp(id: string) {
        const response = await fetch(`http://localhost:3000/applications/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json", // Added quotes here
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            setAppError(data.error || "Something went wrong");
            return;
        }
        await getApp();
    }

    async function patchApp(id: string, newStat: string) {
        const response = await fetch(`http://localhost:3000/applications/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json", // Added quotes here
                "Authorization": `Bearer ${token}`,
            },
            body:
                JSON.stringify(
                    {
                        status: newStat,
                    }
                ),
        });
        const data = await response.json();
        if (!response.ok) {
            setAppError(data.error || "Something went wrong");
            return;
        }
        await getApp();
    }

    async function parseJob() {
        setParsing(true);
        const response = await fetch(`http://localhost:3000/parse-job`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`,
            },
            body:
                JSON.stringify({
                    text: jobText
                })
        });

        const data = await response.json();
        if (!response.ok) {
            setAppError(data.error || "Something went wrong");
            setParsing(false);
            return;
        }


        setCompany(data.company);
        setRole(data.role);
        setStatus(data.status);
        setNotes(data.notes);
        setParsing(false);
    }

    async function getJobs() {
        setParsingJob(true);
        const response = await fetch(`http://localhost:3000/jobs` , {
            method: "GET",
            headers : {
                "Authorization" : `Bearer ${token}`,
            },
        });
        const data = await response.json();
        setJobs(data);
        setParsingJob(false);
    }


    return (
        <>
        {token && (
        <div className="page page-wide">
          <div className="header-row">
            <div className="brand">AI Job Tracker</div>
            <button className="btn btn-secondary" onClick={handleLogout}>Log out</button>
          </div>

          <h2 className="section-title">Add an application</h2>
          <div className="card">
            <FormField id="company-input" label="Company" value={company} onChange={setCompany} placeholder="e.g. Acme Corp" />
            <FormField id="role-input" label="Role" value={role} onChange={setRole} placeholder="e.g. Backend Engineer" />
            <FormField id="status-input" label="Status" value={status} onChange={setStatus} placeholder="e.g. applied" />
            <FormField id="notes-input" label="Notes" value={notes} onChange={setNotes} placeholder="Optional notes" />
            <div className="btn-row">
              <button className="btn" onClick={submitApp}>Submit</button>
            </div>
            {appError && <p className="error-text">{appError}</p>}
          </div>

          <h2 className="section-title">Your applications</h2>
          <div className="btn-row" style={{ marginBottom: 14 }}>
            <button className="btn btn-secondary" onClick={getApp}>Refresh</button>
          </div>
          <ul className="list">
            {applications.map((app) => (
              <li className="list-item" key={app.id}>
                <div className="list-item-main">
                  <span className="list-item-title">{app.company}</span>
                  <span className="list-item-sub">{app.role}</span>
                </div>
                <div className="list-item-actions">
                  <span className={`status-badge status-${app.status}`}>{app.status}</span>
                  <select className="select" value={app.status} onChange={(e) => patchApp(app.id, e.target.value)}>
                    <option value="applied">applied</option>
                    <option value="interviewing">interviewing</option>
                    <option value="offer">offer</option>
                    <option value="rejected">rejected</option>
                  </select>
                  <button className="btn btn-danger" onClick={() => deleteApp(app.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          <hr className="divider" />

          <h2 className="section-title">Parse a job posting</h2>
          <div className="card">
            <textarea className="input" value={jobText} onChange={(e) => setJobText(e.target.value)} placeholder="Paste a job posting here..." />
            <div className="btn-row">
              <button className="btn" onClick={parseJob} disabled={parsing}>{parsing ? "Parsing..." : "Parse with AI"}</button>
            </div>
          </div>

          <h2 className="section-title">Browse jobs</h2>
          <div className="btn-row" style={{ marginBottom: 14 }}>
            <button className="btn btn-secondary" onClick={getJobs} disabled={parsingJob}>{parsingJob ? "Loading..." : "Browse Jobs"}</button>
          </div>
          <ul className="list">
            {jobs.map((job) => (
              <li className="list-item" key={job.id}>
                <div className="list-item-main">
                  <span className="list-item-title">{job.company}</span>
                  <span className="list-item-sub">{job.position}</span>
                </div>
                <div className="list-item-actions">
                  <button className="btn btn-secondary" onClick={() => {
                      setCompany(job.company);
                      setRole(job.position);
                      setStatus("applied");
                      setNotes(job.tags.join(", ")); // [python, backend, senior] => "python, backend,"
                  }}>Fill Form</button>
                  <a className="link" href={job.url} target="_blank" rel="noopener noreferrer">View</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </>
    )
}


export default ApplicationPage;
