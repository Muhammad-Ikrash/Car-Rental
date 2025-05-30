const Task = require("../models/userModel");

exports.GetDashboardStats = async (req, res) => {

    try {

        const stats = await Task.GetDashboardStats();

        if (!stats)
            return res.status(404).json({ message: "No stats found!" });

        res.status(200).json(stats);

    } catch (err) {
        res.status(500).json({ message: "Error fetching stats!" });
    }

}

exports.GetAllUsers = async (req, res) => {

    try {

        const users = await Task.GetAllUsers();

        if (!users)
            return res.status(404).json({ message: "No users found!" });

        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({ message: "Error fetching users!" });
    }

}

exports.LoginUser = async (req, res) => {

    // validate shit

    const { username, password } = req.body;
    const user = await Task.LoginUser(username, password);

    if (!user)
        return res.status(401).json({ message: "Invalid credentials!" });

    res.status(200).json({ message: "Login successful!", user });


}

exports.RegisterUser = async (req, res) => {

    // validate shit
    
    const { username, password, email, role, statusID } = req.body;
    await Task.RegisterUser(username, password, email, role, statusID);

    res.status(201).json({ message: "User registered successfully!" });

}

exports.UpdateUserStatus = async (req, res) => {

    const { userID, statusID } = req.body;
    await Task.UpdateUserStatus(userID, statusID);

    res.status(204).json({ message: "User status updated successfully!" });

}

exports.DeleteUser = async (req, res) => {

    await Task.DeleteUser(req.params.userID);

    res.status(204).json({ message: "User deleted successfully!" });

}