import React, { useState, useEffect } from 'react'

export default function ProfileUpdatePwdRWD() {
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        user_name: '',
        account: '',
        gender: '',
        birthday: '',
        member_level_id: '',
        phone: '',
        address: ''
    })

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        setIsLoading(true)
        try {
            // 從 localStorage 獲取令牌
            const token = localStorage.getItem('authToken');
            console.log('Token:', token);  // 打印出Token的值

            const response = await fetch('http://localhost:3005/api/dashboard/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,// 添加授權頭
                    'Content-Type': 'application/json',
                    credentials: 'include' // 這會包含 cookies
                }
            })
            if (!response.ok) {
                throw new Error('Failed to fetch user data')
            }
            const data = await response.json()
            console.log('Fetched data:', data);

            const user = data?.data?.user || data?.user || data;
            if (user && typeof user === 'object') {
                setUserData(user);
                setFormData({
                    user_name: user.user_name,
                    account: user.account,
                    birthday: user.birthday,
                    gender: user.gender,
                    phone: user.phone,
                    address: user.address,
                    member_level_id: user.member_level_id,
                });
            } else {
                throw new Error('User data is not available or in unexpected format');
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError(err.message);
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3005/api/dashboard/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            if (!response.ok) {
                throw new Error('Failed to update profile')
            }
            // 更新成功後的操作，例如顯示成功消息
            alert('Profile updated successfully')
            fetchUserData() // 重新獲取用戶數據以刷新頁面
        } catch (err) {
            setError(err.message)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match')
            return
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3005/api/dashboard/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                })
            })
            if (!response.ok) {
                throw new Error('Failed to update password')
            }
            // 密碼更新成功後的操作
            alert('Password updated successfully')
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            setError(err.message)
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <>
            <section className="editPwd-card-rwd ">
                <h2 className="edit-card-title">修改密碼</h2>
                <label htmlFor="">舊密碼</label> <span>*舊密碼輸入錯誤</span>
                <input
                    type="text"
                    name=""
                    placeholder="********"
                    style={{ width: "100%" }}
                />
                <br />
                <label htmlFor="">新密碼</label>
                <input
                    type="text"
                    placeholder="********"
                    style={{ width: "100%" }}
                />
                <br />
                <label htmlFor="">再次輸入新密碼</label> <span>*密碼內容輸入錯誤</span>
                <input
                    type="text"
                    placeholder="********"
                    style={{ width: "100%" }}
                />
            </section>
        </>
    )
}