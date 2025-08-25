import React, { useContext, useEffect, useState } from "react";
import {
    IonPage,
    IonHeader,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCheckbox,
    IonInput,
    IonTextarea,
    IonButton,
    IonModal,
    IonToast
} from "@ionic/react";
import Header from './head';
import Axios, { baseURL } from "../service/jwtAuth";
import { PolishContext } from "../context/PolishContext";
import { useHistory, useLocation } from "react-router-dom";
import Bottom from './bottomtab';

const Jewel = () => {
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const { setSearchpolish, searchpolish } = useContext(PolishContext);
    const [selectedOptionss, setSelectedOptionss] = useState({});
    const [carat, setCarat] = useState({ from: "", to: "" });
    const [US$CT, setUS$CT] = useState({ from: "", to: "" });
    const [stoneId, setStoneId] = useState("");
    const [data, setData] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(false);
    const [showVVS2, setShowVVS2] = useState(false);
    const [remark, setRemark] = useState('');
    const [isAdvanceSearchOpen, setIsAdvanceSearchOpen] = useState(false);
    const [GRWT, setGRWT] = useState({ from: "", to: "" });
    const [NEWT, setNEWT] = useState({ from: "", to: "" });
    const [advanceSearchFields, setAdvanceSearchFields] = useState({
        memo: false,
        available: false,
        hold: false,
    });
    const [searchResults, setSearchResults] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();


    const categories = {
        Shape: [
            {
                name: "RING", shapeicon: <img src="/public/jewelsvg/RING.svg" alt="ring" />
            },
            {
                name: "EARRING", shapeicon: <img src="/public/jewelsvg/EARRING.svg" alt="EARRING" />
            },
            {
                name: "NECKLACE", shapeicon: <img src="/public/jewelsvg/NECKLACE.svg" alt="NECKLACE" />
            },
            {
                name: "BRACELET", shapeicon: <img src="/public/jewelsvg/BRACELET.svg" alt="BRACELET" />
            },
            {
                name: "PENDANT", shapeicon: <img src="/public/jewelsvg/PENDANT.svg" alt="PENDANT" />
            },
            {
                name: "OVAL BANGLE", shapeicon: <img src="/public/jewelsvg/OVAL BANGLE.svg" alt="OVAL BANGLE" />
            },
            {
                name: "OTHER", shapeicon: <img src="/public/jewelsvg/OTHER.svg" alt="OTHER" />
            },
        ],
        Metaltype: ['GOLD', 'SLIVER', 'PLATINUM'],
        Clarity: ['VS+', 'SI+', 'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3'],
        FL_MAIN_LOT: ['-2', '+2-6.5', '+6.5-11', '+11-14', '1/10', '1/6', '1/5', '1/4', '1/3', '3/8', '1/2', '3/4', 'None', '+7-10', '-', '+1.5-2', '1.04DABBI', '1.00-1.49', '+00-0', '+000-00', '+0-1'],
        location: []

    };



    const storedData = localStorage.getItem('branches');
    const datas = JSON.parse(storedData);


    // Populate the location category with branch names
    const locations = datas?.map(branch => branch.FL_BRANCH_NAME);

    // Add the location category to categories
    categories.location = locations;

    const handleOthersClick = () => {
        setShowVVS2((prev) => !prev);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    useEffect(() => {
        if (searchpolish) {
            setSelectedOptionss({
                SHAPES: searchpolish.SHAPE || [],
                Clarity: searchpolish.CLARITY || [],
                Metaltype: searchpolish.Metaltype || [],
                FL_MAIN_LOT: searchpolish.FL_MAIN_LOT || [],
                Location: searchpolish.location || [],
            });

            setCarat({
                from: searchpolish.FromCarate || "",
                to: searchpolish.ToCarate || "",
            });

            setGRWT({
                from: searchpolish.FromGRWT || "",
                to: searchpolish.ToGRWT || "",
            });

            setNEWT({
                from: searchpolish.FromNEWT || "",
                to: searchpolish.ToNEWT || "",
            });

            setStoneId(searchpolish.stoneCert || "");

            setAdvanceSearchFields({
                memo: !!searchpolish.Memo,
                available: !!searchpolish.A,
                hold: !!searchpolish.Hold,
            });

        }
    }, [searchpolish]);



    useEffect(() => {
        const storedOptions = localStorage.getItem('selectedOptionss');
        if (storedOptions) {
            setSelectedOptionss(JSON.parse(storedOptions));
            // console.log('Stored Options:', JSON.parse(storedOptions));
        }
    }, []);

    // useEffect(() => {
    //   localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
    // }, [selectedOptions]);

    useEffect(() => {
        if (location.state?.selectedOptionss) {
            setSelectedOptionss(location.state.selectedOptionss);
        }
    }, [location.state?.selectedOptionss]);

    const handleCheckboxChange = (category, option) => {
        setSelectedOptionss((prev) => {
            const newSelected = { ...prev };
            if (!newSelected[category]) newSelected[category] = [];
            if (newSelected[category].includes(option)) {
                newSelected[category] = newSelected[category].filter((item) => item !== option);
            } else {
                newSelected[category] = [...newSelected[category], option];

            }
            return newSelected;
        });

    };


    useEffect(() => {
        let isMounted = true; // Track whether the component is still mounted

        const fetchData = async () => {
            try {
                const response = await Axios.get('search/parmas?type=single');
                if (isMounted) {
                    setData(response.data.data); // Update state only if the component is still mounted

                }

            } catch (err) {
                if (isMounted) {
                    setError("Failed to fetch data. Please try again."); // Set error state
                }
                console.error("Error fetching data:", err);
            }
        };

        fetchData(); // Call the async function

        // Cleanup function to prevent state updates on an unmounted component
        return () => {
            isMounted = false;
        };
    }, []);


    // Handle advance search toggle
    const handleAdvanceSearchClick = () => {
        setIsAdvanceSearchOpen((prev) => !prev);
    };

    // Handle input changes for advance search fields
    const handleAdvanceSearchInputChange = (field, value) => {
        setAdvanceSearchFields((prev) => ({
            ...prev,
            [field]: value,
        }));
    };




    const handlesearch = async () => {

        setIsLoading(true);
        const payload = {
            CLARITY: selectedOptionss.Clarity || [],
            Metaltype: selectedOptionss.Metaltype || [],
            FromCarate: carat.from || "",
            ToCarate: carat.to || "",
            FromGRWT: GRWT.from || "",
            ToGRWT: GRWT.to || "",
            FromNEWT: NEWT.from || "",
            ToNEWT: NEWT.to || "",
            SHAPE: selectedOptionss.SHAPES || [],
            stoneCert: stoneId || "",
            FL_MAIN_LOT: selectedOptionss.FL_MAIN_LOT || [],
            location: selectedOptionss.Location || [],
            Memo: advanceSearchFields.memo,
            A: advanceSearchFields.available,
            Hold: advanceSearchFields.hold,
        };

        const cleanPayloads = Object.fromEntries(
            Object.entries(payload).filter(([_, value]) => value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0))
        );

        setSearchpolish(cleanPayloads);

        try {
            const response = await Axios.post('search/bulk/stoneUser', JSON.stringify(cleanPayloads));

            if (response.status === 200) {
                // Update state here if necessary
                setSearchpolish(response.data.result);
                setToastMessage(response?.data?.status);
                setShowToast(true);
                // Navigate to the new page
                history.push({
                    pathname: `/polishtableshows`,
                    state: { searchResults: response.data.result, selectedOptionss: selectedOptionss }
                });
                // window.location.reload()
            } else {
                setError(data.message);
                setToastMessage(err.response.data.message)
                // setToastMessage('User not found.');
                setShowToast(true);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
        finally {
            setIsLoading(false); // Set loading to false after search completes or fails
        }
    };


    return (
        <IonPage>

            <Header />

            <IonContent>
                <IonGrid style={{ marginBottom: "20px" }}>
                    <div style={{ marginTop: '20px' }}>
                        <h5 class="text-center mb-5 element">Polish Parcel</h5>
                    </div>
                    <div style={{ display: "flex", justifyContent: "start", alignContent: "center", gap: "15px", padding: "20px 7px" }}>
                        <a href='/home'>
                            <button className="sumbutton sumbutton-11">Polish Certified</button>
                        </a>
                        <a href='/polish'>
                            <button type="button" class="sumbutton sumbutton-11 ">Polish Parcel</button>
                        </a>
                        <a href='/jewel'>
                            <button type="button" class="sumbutton ">Jewelry</button>
                        </a>
                    </div>
                    <IonRow>
                        <IonCol size="12">
                            <div className="main-box main2">
                                <div className="checkbox-group">
                                    {categories.Shape.map((option) => (
                                        <span key={option.name}
                                            className={`checkbox-label ${selectedOptionss.SHAPES?.includes(option.name.toUpperCase()) ? 'selected' : ''}`}
                                            onClick={() => handleCheckboxChange("SHAPES", option.name.toUpperCase())}>
                                            {option.shapeicon}
                                            {option.name}

                                        </span>
                                    ))}

                                </div>
                            </div>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol size="12">
                            <div className="main-box">
                                {["Metaltype"].map((category) => (
                                    <div className="mainbox" key={category}>
                                        <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>Metal type</h5>
                                        <div className="checkbox-group">
                                            {categories[category].map((option) => (
                                                <span key={option}
                                                    className={`checkbox-label ${selectedOptionss[category]?.includes(option) ? 'selected' : ''}`}
                                                    onClick={() => handleCheckboxChange(category, option)}>
                                                    {option}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <div className="main-box">
                                <h5 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>ITEM/Style Code</h5>
                                <textarea
                                    style={{ width: '100%', borderRadius: '8px', background: '#fff8ef' }}
                                    className="forminput"
                                    placeholder="Enter ITEM/Style Code"
                                    value={stoneId}
                                    onChange={(e) => setStoneId(e.target.value)}
                                />
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <div className="main-box">
                                <h5 style={{ textTransform: 'uppercase' }}>GR WT</h5>
                                <IonRow>
                                    <IonCol size="6" sizeMd="6">
                                        <input
                                            style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                                            type="number"
                                            class="form-control"
                                            name="GRWT From"
                                            placeholder="GR WT From"
                                            value={GRWT.from}
                                            onChange={(e) => setGRWT({ ...GRWT, from: e.target.value })}
                                        />
                                    </IonCol>
                                    <IonCol size="6" sizeMd="6">
                                        <input
                                            style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                                            type="number"
                                            class="form-control"
                                            name="GRWT To"
                                            placeholder="GR WT To "
                                            value={GRWT.to}
                                            onChange={(e) => setGRWT({ ...GRWT, to: e.target.value })}
                                        />
                                    </IonCol>
                                </IonRow>
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <div className="main-box">
                                <h5 style={{ textTransform: 'uppercase' }}>NE WT</h5>
                                <IonRow>
                                    <IonCol size="6" sizeMd="6">
                                        <input
                                            style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                                            type="number"
                                            class="form-control"
                                            name="NEWT From"
                                            placeholder="NE WT From"
                                            value={NEWT.from}
                                            onChange={(e) => setNEWT({ ...NEWT, from: e.target.value })}
                                        />
                                    </IonCol>
                                    <IonCol size="6" sizeMd="6">
                                        <input
                                            style={{ background: '#ffdeb300', color: '#000', width: '100%', marginBottom: '5px', borderRadius: '8px', border: '1px solid #4c3226' }}
                                            type="number"
                                            class="form-control"
                                            name="NEWT To"
                                            placeholder="NE WT To"
                                            value={NEWT.to}
                                            onChange={(e) => setNEWT({ ...NEWT, to: e.target.value })}
                                        />
                                    </IonCol>
                                </IonRow>
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <div className="main-box">
                                <h5 style={{ textTransform: 'uppercase' }}>Status</h5>
                                <IonRow>
                                    <IonCol size="12" sizeMd="6">
                                        <div className="" style={{ display: 'flex' }} >
                                            <label style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={advanceSearchFields.available}
                                                    onChange={(e) =>
                                                        handleAdvanceSearchInputChange(
                                                            "available",
                                                            e.target.checked
                                                        )
                                                    }
                                                    style={{ width: '23px' }}
                                                />
                                                Available
                                            </label>
                                        </div>                                  
                                    </IonCol>
                                </IonRow>
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12" className="ion-text-center" style={{ marginTop: '10px' }}>
                            <div className="mainbtn">
                                <button className="sumbutton" onClick={handlesearch} disabled={isLoading} >{isLoading ? "Loading..." : "Search"}</button>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                />

            </IonContent>
            <Bottom />
        </IonPage>
    );
};

export default Jewel;
