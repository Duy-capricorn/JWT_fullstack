'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
// import dynamic from 'next/dynamic';

import { fetchAllUser, deleteUser } from '@/services/userService';
import ModalDeleteUser from '@/components/modals/modalDeleteUser';
import ModalUser from '@/components/modals/modalUser';

function UserPage() {
    const router = useRouter();

    const [listUsers, setListUsers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(3);
    const [totalPage, setTotalPage] = useState(0);

    // modal delete
    const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);
    const [dataModal, setDataModal] = useState({});

    // modal update/create user
    const [showModalUser, setShowModalUser] = useState(false);
    const [actionModalUser, setActionModalUser] = useState();
    const [dataModalUser, setDataModalUser] = useState({});

    useEffect(() => {
        let session = sessionStorage.getItem('account');
        if (session) {
            fetchUsers();
        } else {
            toast.warning('You don not Login in system!');
            router.push('/login');
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        let response = await fetchAllUser(currentPage, currentLimit);
        if (response && response.data && response.data.EC === 0) {
            // setListUsers(response.data.DT);
            // console.log(response.data.DT);

            setTotalPage(response.data.DT.totalPages);
            setListUsers(response.data.DT.users);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(event.selected + 1);
        // await fetchUsers(event.selected + 1);
    };

    const handleDelete = async (user) => {
        let response = await deleteUser(user);
        if (response && response.data && response.data.EC === 0) {
            toast.success(response.data.EM);
            await fetchUsers();
            handleClose();
        } else {
            toast.error(response.data.EM);
        }
    };

    const handleClose = () => {
        setShowModalDeleteUser(false);
    };

    const handleShow = (user) => {
        setDataModal(user);
        setShowModalDeleteUser(true);
    };

    // MODAL USER
    // const ModalUser = dynamic(() => import('@/components/modals/modalUser'), { showModalUser: false });

    const handleShowUser = () => {
        setActionModalUser('CREATE');
        setShowModalUser(true);
    };

    const handleCloseShowUser = async () => {
        setShowModalUser(false);
        setDataModalUser({});
        await fetchUsers();
    };

    const handleEditUser = (user) => {
        setShowModalUser(true);
        setDataModalUser(user);
        setActionModalUser('UPDATE');
    };

    return (
        <>
            <div className="manage_container container">
                <div className="userHeader">
                    <div className="title">
                        <h3>TABLE USERS</h3>
                    </div>
                    <div className="action">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                fetchUsers();
                            }}
                        >
                            Refresh
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => {
                                handleShowUser();
                                setActionModalUser('CREATE');
                            }}
                        >
                            Add new user
                        </button>
                    </div>
                    <div className="user-body">
                        <table className="table table-dark table-striped-columns table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">id</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">User name</th>
                                    <th scope="col">Group</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUsers ? (
                                    listUsers.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                                <td>{item.id}</td>
                                                <td>{item.email}</td>
                                                <td>{item.username}</td>
                                                <td>{item.Group ? item.Group.name : ''}</td>
                                                <td>{item.Group ? item.Group.description : ''}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-warning mx-3"
                                                        onClick={() => {
                                                            handleEditUser(item);
                                                        }}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => {
                                                            handleShow(item);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                                <ModalDeleteUser
                                                    show={showModalDeleteUser}
                                                    onHide={handleClose}
                                                    handleDelete={() => {
                                                        handleDelete(item);
                                                    }}
                                                    dataModal={dataModal}
                                                />
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>Not found data!</tr>
                                )}
                            </tbody>
                        </table>
                        {totalPage > 0 && (
                            <div className="container">
                                <ReactPaginate
                                    nextLabel="next >"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPage}
                                    previousLabel="< previous"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakLabel="..."
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination"
                                    activeClassName="active"
                                    renderOnZeroPageCount={null}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalUser
                show={showModalUser}
                actions={actionModalUser}
                data_modal_user={dataModalUser}
                onHide={() => {
                    handleCloseShowUser();
                }}
            />
        </>
    );
}

export default UserPage;
