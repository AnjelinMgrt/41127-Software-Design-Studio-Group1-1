import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
import { MainTable } from "../../figures/components/MainTable";
import { getUserID } from "../../App";
import { useNavigate } from "react-router-dom";
import { CreateAnAnnouncement } from "./CreateAnAnnouncement";
import { Edit } from "@mui/icons-material";

export const AnnouncementList = (props) => {
    const [userID, setUserID] = useState();
    const [state, setState] = useState({
        data: []
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        try {
            if (userID != null && userID !== "none") getEnrollment();
        } catch (error) {
            console.log(error);
        }
    }, [userID]);

    if (userID === "none") return window.location.href = "/signin";

    const getEnrollment = () => {
        setLoading(true)
        fetch("/api/announcement/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        data: data.announcements
                    }))
                }
                setLoading(false)

            });
    }

    const AnnouncementTable = () => {
        const columns = [
            {
                id: 'announcement_id',
                numeric: false,
                disablePadding: true,
                label: 'Announcement Id',
            },
            {
                id: 'announcement_title',
                numeric: false,
                disablePadding: false,
                label: 'Announcement Title',
            },
            {
                id: 'announcement_date',
                numeric: false,
                disablePadding: false,
                label: 'Date',
            },
            {
                id: 'edit',
                numeric: true,
                disablePadding: false,
                label: 'Action',
            },
        ]
        const handleCreate = _ => {
            navigate(`/announcementlist/create`)
        };


        const handleDelete = (selected) => {
            fetch("/api/announcement/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    list: selected
                })
            })
                .then((res) => { return res.json(); })
                .then((data) => {
                    if (data.status) {
                        getEnrollment()
                    }
                    setLoading(false)

                });
        }

        return (
            MainTable(columns, state.data, cellFormat, "Announcement List", "New Announcement", handleCreate, "Delete Announcement", handleDelete)
        );
    };
    const cellFormat = (handleClick, isSelected, index, row) => {
        const isItemSelected = isSelected(row.announcement_id);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.announcement_id}
                selected={isItemSelected}
            >
                <TableCell className="table-cell" padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        onClick={(event) => handleClick(event, row.announcement_id)}
                    />
                </TableCell>
                <TableCell
                    className="table-cell"
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                >
                    {row.announcement_id}
                </TableCell>
                <TableCell className="table-cell" align="center">{row.announcement_title}</TableCell>
                <TableCell className="table-cell" align="center">{row.announcement_date}</TableCell>
                <TableCell className="table-cell" align="center"><IconButton onClick={() => navigate(`/`)}><Edit /></IconButton></TableCell>
            </TableRow>
        );
    };

    return (
        <section>
            {
                loading ? <div className="container">Loading...</div> : <AnnouncementTable />
            }

        </section>
    );
};

