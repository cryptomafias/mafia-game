import React from "react";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";

function Avatar({value}){
    const avatars = new Avatars(sprites, {height: 100, width: 100})
    const avatar = avatars.create(value)
    return (
        <div className="Container" dangerouslySetInnerHTML={{__html: avatar}}></div>
    )
}

export default Avatar

