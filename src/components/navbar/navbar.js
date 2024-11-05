import {Container} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';
import {Navbar} from 'react-bootstrap';
import './nav.css';
import { UserContext } from '../../App';
import { useContext } from 'react';
import { MdOutlineCalendarToday } from "react-icons/md";
function NavBar() {
    const { userState, userDispatch } = useContext(UserContext)
    const user = userState.user
    const handleLogout = () => {
        localStorage.removeItem('token')
        userDispatch({ type: 'LOGOUT_USER' })
        window.location.href = '/login'
    }
    return (
        <>
            <Navbar bg="primary" className="sticky-navbar" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/" className="me-auto"><MdOutlineCalendarToday />
                    </Navbar.Brand>
                    {!user._id ? (
                        <Nav className="ms-auto">
                            <Nav.Link href="/login" >Login</Nav.Link>
                            <Nav.Link href="/register">SignUp</Nav.Link>
                        </Nav>
                    ) : (
                            <Nav className="ms-auto">
                                <Nav.Link href="/login" onClick={handleLogout} style={{ backgroundColor: "red", color: "white", borderRadius:"3px" }} >Logout</Nav.Link>
                                
                        </Nav>
                    )}
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;