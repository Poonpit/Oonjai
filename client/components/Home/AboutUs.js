import React from "react";

const AboutUs = () => {
    return (
        <div className="w-100 text-light mb-5 mt-3">
            <div className="text-center">
                <img
                    src="/logos/Logo.png"
                    style={{
                        width: "16rem",
                    }}
                />
                <div className="text-center">
                    <h1 style={{
                        fontSize: "55px"
                    }}>Oonjai</h1>
                    <div className="w-75 mx-auto text-center">
                        <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est laudantium placeat incidunt
                            laborum perspiciatis ut nesciunt, quam ipsam ratione hic ipsa veritatis natus asperiores,
                            dolorem molestiae fuga architecto
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
