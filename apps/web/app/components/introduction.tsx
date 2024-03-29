import { Badge } from "@ui/components/ui/badge"
import { Button } from "@ui//components/ui/button"

function ShareIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
        </svg>
    )
}

function BookmarkIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
    )
}

export const Introduction =()=>{
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                <div>
                    <h1 className="text-6xl font-bold">One Object, Every hour, Forever.</h1>
                    <p className="mt-4 text-lg">
                        Build a strong, fully on-chain community with Move Object, where everyone from collectors to developers is a fully stored object on the chain!
                    </p>
                </div>
                <div>
                    <iframe width="570" height="320" src="https://www.youtube.com/embed/lOzCA7bZG_k" title="This is Nouns" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                <div>
                    <iframe width="570" height="320" src="https://www.youtube.com/embed/oa79nN4gMPs" title="What is Nouns DAO and How Does it Work?" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </div>
                <div>
                    <h2 className="text-4xl font-bold">Build With Objects.</h2>
                    <p className="mt-4 text-lg">
                        Everyone can contribute to ObjectsDao, we welcome all projects built on ObjectsDao, ObjectsDao will continue to support the promotion and development of the complete chain of applications, protocols and other technology related through financial support.
                    </p>
                </div>
            </div>
        </div>
    )
}
