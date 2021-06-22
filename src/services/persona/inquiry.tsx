import React from "react";
import Persona from "persona";
import { User } from "../../interfaces/User";

interface UserProp {
    user: User;
}

export const InlineInquiry: React.FC<UserProp> = ({ user }: UserProp) => {
    return (
        <>
            <div style={{ height: "500px", display: "flex" }}>
                <Persona.Inquiry
                    templateId="tmpl_pSp6SHUWLXufK4PRnvDW9ov1"
                    environment="sandbox"
                    language="english"
                    onLoad={(error) => {
                        console.log("Loaded inline");
                    }}
                    onStart={(inquiryId) => {
                        console.log(`Started inquiry ${inquiryId}`);
                    }}
                    onComplete={(inquiryId) => {
                        console.log(`Sending finished inquiry ${inquiryId} to backend`);
                        fetch(`/server-handler?inquiry-id=${inquiryId}`);
                    }}
                    accountId={user.bitclout.publicKey}
                    prefill={{}}
                />
            </div>
        </>
    );
};
