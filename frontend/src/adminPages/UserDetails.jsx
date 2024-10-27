import UserTable from "../adminComponents/UserTable";
import { Link } from "react-router-dom";

const UserDetails = () => {
    return (
        <div className='flex-[4_4_0] mr-auto border-r border-gray-700 bg-gray-800 min-h-screen p-6'>
            <Link to="/admin"
                className="relative top-2 bg-gray-900 text-white px-2 py-2 rounded mb-4 text-lg"
            >
                Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-200 mb-4 text-center">
                Suspected User Details
            </h1>
            <UserTable />
        </div>
    );
};

export default UserDetails;
