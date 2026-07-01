import { useContext, useEffect, useState } from "react"
import Styles from "./analyse.module.css"
import { Heat } from "@alptugidin/react-circular-progress-bar"
import { UserContext } from "../context/usercontext"
import { useNavigate } from "react-router-dom"

function Analyse() {
    const navigate = useNavigate()
    const [score, setscore] = useState(0)
    const [atsscore, setatsscore] = useState(0)
    const [summary, setsummary] = useState("")
    const [experienceLevel, setexperienceLevel] = useState("")
    const [skills, setskills] = useState([])
    const [missingSkills, setmissingSkills] = useState([])
    const [strengths, setstrengths] = useState([])
    const [weaknesses, setweaknesses] = useState([])
    const [interviewTips, setinterviewTips] = useState([])
    const [pros, setpros] = useState([])
    const [cons, setcons] = useState([])
    const [sug, setsug] = useState([])
    const [jobs, setjobs] = useState([])
    const { serviceURL } = useContext(UserContext)
    const [status, setstatus] = useState("loading") // "loading" | "done" | "error"

    useEffect(() => {
        document.getElementById("animate").style.display = "flex"

        fetch(`${serviceURL}/lastReport`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                document.getElementById("animate").style.display = "none"
                if (res.ok) return res.json()
                setstatus("error")
            })
            .then(data => {
                if (data != null) {
                    setscore(data.score ?? 0)
                    setatsscore(data.atsoptimizationscore ?? 0)
                    setsummary(data.summary ?? "")
                    setexperienceLevel(data.experienceLevel ?? "")
                    setskills(Array.isArray(data.skills) ? data.skills : [])
                    setmissingSkills(Array.isArray(data.missingSkills) ? data.missingSkills : [])
                    setstrengths(Array.isArray(data.strengths) ? data.strengths : [])
                    setweaknesses(Array.isArray(data.weaknesses) ? data.weaknesses : [])
                    setinterviewTips(Array.isArray(data.interviewTips) ? data.interviewTips : [])
                    setpros(Array.isArray(data.pros) ? data.pros : [])
                    setcons(Array.isArray(data.cons) ? data.cons : [])
                    setsug(Array.isArray(data.suggestions) ? data.suggestions : [])
                    setjobs(Array.isArray(data.jobs) ? data.jobs : [])
                    setstatus("done")
                } else {
                    setstatus("error")
                }
            })
            .catch(error => {
                console.log(error)
                document.getElementById("animate").style.display = "none"
                setstatus("error")
            })
    }, [])

    return (
        <div className={Styles.container}>
            <div className={Styles.nav}>
                <h1>Resume Analyser</h1>
                <button onClick={() => navigate("/uploaddoc")}>Analyse</button>
            </div>

            <div className={Styles.loadani} id="animate">
                <div className={Styles.loadanimation}>
                    <div className={Styles.capstart}></div>
                    <div className={Styles.loadblock}></div>
                </div>
                <h1>Preparing Report</h1>
            </div>

            {status === "done" &&
                <div className={Styles.doc}>
                    <div className={Styles.report}>
                        <div className={Styles.sc1}>
                            <Heat
                                progress={score}
                                range={{ from: 0, to: 100 }}
                                sign={{ value: '', position: 'end' }}
                                showValue={true}
                                revertBackground={true}
                                text={'Overall Score'}
                                sx={{
                                    barWidth: 7,
                                    bgColor: ' #2c2c2cb1',
                                    bgStrokeColor: '#ffffff',
                                    valueSize: 13,
                                    textSize: 10,
                                    valueFamily: 'Poppins',
                                    textFamily: 'Poppins',
                                    valueWeight: 'normal',
                                    textWeight: 'normal',
                                    textColor: '#ffffffff',
                                    valueColor: '#ffffffff',
                                    loadingTime: 1000,
                                    strokeLinecap: 'round',
                                    valueAnimation: true,
                                }}
                            />
                        </div>
                        <div className={Styles.sc2}>
                            <Heat
                                progress={atsscore}
                                range={{ from: 0, to: 100 }}
                                sign={{ value: '', position: 'end' }}
                                showValue={true}
                                revertBackground={true}
                                text={'ATS optimization score'}
                                sx={{
                                    barWidth: 7,
                                    bgColor: ' #2c2c2cb1',
                                    bgStrokeColor: '#ffffff',
                                    valueSize: 13,
                                    textSize: 7,
                                    valueFamily: 'Poppins',
                                    textFamily: 'Poppins',
                                    valueWeight: 'normal',
                                    textWeight: 'normal',
                                    textColor: '#ffffffff',
                                    valueColor: '#ffffffff',
                                    loadingTime: 1000,
                                    strokeLinecap: 'round',
                                    valueAnimation: true,
                                }}
                            />
                        </div>
                    </div>

                    {(summary || experienceLevel) &&
                        <div className={Styles.summaryCard}>
                            {experienceLevel &&
                                <span className={Styles.expBadge}>{experienceLevel} level</span>
                            }
                            {summary && <p className={Styles.summaryText}>{summary}</p>}
                        </div>
                    }

                    {(skills.length > 0 || missingSkills.length > 0) &&
                        <div className={Styles.skillsRow}>
                            {skills.length > 0 &&
                                <div className={Styles.skillsBox}>
                                    <h2>Skills Found</h2>
                                    <div className={Styles.tagWrap}>
                                        {skills.map((item, index) =>
                                            <span className={Styles.tagGood} key={index}>{item}</span>
                                        )}
                                    </div>
                                </div>
                            }
                            {missingSkills.length > 0 &&
                                <div className={Styles.skillsBox}>
                                    <h2>Missing Skills</h2>
                                    <div className={Styles.tagWrap}>
                                        {missingSkills.map((item, index) =>
                                            <span className={Styles.tagMissing} key={index}>{item}</span>
                                        )}
                                    </div>
                                </div>
                            }
                        </div>
                    }

                    <div className={Styles.rev}>
                        {strengths.length > 0 &&
                            <div className={Styles.pros}>
                                <h2>Strengths</h2>
                                <ul>
                                    {strengths.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </div>
                        }
                        {weaknesses.length > 0 &&
                            <div className={Styles.cons}>
                                <h2>Weaknesses</h2>
                                <ul>
                                    {weaknesses.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </div>
                        }
                        {pros.length > 0 &&
                            <div className={Styles.pros}>
                                <h2>Pros</h2>
                                <ul>
                                    {pros.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </div>
                        }
                        {cons.length > 0 &&
                            <div className={Styles.cons}>
                                <h2>Cons</h2>
                                <ul>
                                    {cons.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </div>
                        }
                        {sug.length > 0 &&
                            <div className={Styles.sug}>
                                <h2>Tips to enhance</h2>
                                <ul>
                                    {sug.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </div>
                        }
                        {interviewTips.length > 0 &&
                            <div className={Styles.sug}>
                                <h2>Interview Preparation</h2>
                                <ul>
                                    {interviewTips.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </div>
                        }
                        {jobs.length > 0 &&
                            <div className={Styles.jobs}>
                                <h2>Suggested Jobs</h2>
                                {jobs.map((item, index) =>
                                    <div className={Styles.jobidiv} key={index}>
                                        <h3 className={Styles.jobtitle}>Role : {item.title}</h3>
                                        <h4 className={Styles.com}>Company : {item.company?.display_name?.trim() || "Not specified"}</h4>
                                        <h4 className={Styles.loc}>Location : {item.location?.display_name?.trim() || "Not specified"}</h4>
                                        <h4 className={Styles.cat}>Category : {item.category?.label?.trim() || "Not specified"}</h4>
                                        <p className={Styles.jobdes}>{item.description}</p>
                                        <a className={Styles.joblink} href={item.redirect_url} target="_blank">Apply now</a>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                </div>
            }

            {status === "error" &&
                <h1 className={Styles.errinfo}>
                    Something went wrong, please try again after some time!
                </h1>
            }
        </div>
    )
}

export default Analyse