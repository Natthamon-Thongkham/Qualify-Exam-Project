"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";

type Role = "Student" | "Teacher" | "Admin";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  studentId?: string;
  password: string;
};

type UserForm = {
  fullName: string;
  email: string;
  role: Role;
  studentId: string;
  password: string;
};

const initialUsers: User[] = [
  {
    id: "000007",
    fullName: "Sara Khan",
    email: "sara@university.com",
    role: "Student",
    studentId: "2310511101110",
    password: "Sara@123456",
  },
  {
    id: "000008",
    fullName: "Ali Ahmed",
    email: "ali@university.com",
    role: "Student",
    studentId: "2310511101111",
    password: "Ali@123456",
  },
  {
    id: "000009",
    fullName: "Fatima Noor",
    email: "fatima@university.com",
    role: "Admin",
    studentId: "",
    password: "Fatima@123456",
  },
  {
    id: "000010",
    fullName: "Hassan Ali",
    email: "hassan@university.com",
    role: "Teacher",
    studentId: "",
    password: "Hassan@123456",
  },
];

const emptyForm: UserForm = {
  fullName: "",
  email: "",
  role: "Student",
  studentId: "",
  password: "",
};

export default function AdminPanelPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(
    null
  );

  const [form, setForm] = useState<UserForm>(emptyForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(
    null
  );

  const [showPassword, setShowPassword] = useState(false);

  const [importedFileName, setImportedFileName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /*
    ==========================================
    SEARCH + ROLE FILTER
    ==========================================
  */

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchSearch =
        keyword === "" ||
        user.id.toLowerCase().includes(keyword) ||
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.studentId?.toLowerCase().includes(keyword);

      const matchRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  /*
    ==========================================
    OPEN ADD USER
    ==========================================
  */

  const openAddUser = () => {
    setModalMode("add");
    setEditingUserId(null);

    setForm({
      ...emptyForm,
      password: generatePassword(),
    });

    setShowPassword(false);
  };

  /*
    ==========================================
    OPEN EDIT USER
    ==========================================
  */

  const openEditUser = (user: User) => {
    setModalMode("edit");
    setEditingUserId(user.id);

    setForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      studentId: user.studentId ?? "",
      password: user.password,
    });

    setShowPassword(false);
  };

  /*
    ==========================================
    CLOSE MODAL
    ==========================================
  */

  const closeModal = () => {
    setModalMode(null);
    setEditingUserId(null);
    setForm(emptyForm);
    setShowPassword(false);
  };

  /*
    ==========================================
    FORM CHANGE
    ==========================================
  */

  const updateForm = (
    field: keyof UserForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
    ==========================================
    PASSWORD GENERATOR
    ==========================================
  */

  function generatePassword() {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercase = "abcdefghijkmnopqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "@#$!";

    const all =
      uppercase + lowercase + numbers + symbols;

    let password =
      uppercase[Math.floor(Math.random() * uppercase.length)] +
      lowercase[Math.floor(Math.random() * lowercase.length)] +
      numbers[Math.floor(Math.random() * numbers.length)] +
      symbols[Math.floor(Math.random() * symbols.length)];

    while (password.length < 12) {
      password +=
        all[Math.floor(Math.random() * all.length)];
    }

    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  const handleGeneratePassword = () => {
    updateForm("password", generatePassword());
    setShowPassword(true);
  };

  /*
    ==========================================
    CREATE NEXT USER ID
    ==========================================
  */

  const createNextUserId = () => {
    const numbers = users.map((user) =>
      Number(user.id)
    );

    const largest =
      numbers.length > 0 ? Math.max(...numbers) : 0;

    return String(largest + 1).padStart(6, "0");
  };

  /*
    ==========================================
    ADD / SAVE USER
    ==========================================
  */

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      alert(
        "Please fill in Full Name, Email Address and Password."
      );
      return;
    }

    if (
      form.role === "Student" &&
      !form.studentId.trim()
    ) {
      alert("Please enter Student ID.");
      return;
    }

    if (modalMode === "add") {
      const newUser: User = {
        id: createNextUserId(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        role: form.role,
        studentId:
          form.role === "Student"
            ? form.studentId.trim()
            : "",
        password: form.password,
      };

      setUsers((current) => [...current, newUser]);
      closeModal();
      return;
    }

    if (modalMode === "edit" && editingUserId) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                role: form.role,
                studentId:
                  form.role === "Student"
                    ? form.studentId.trim()
                    : "",
                password: form.password,
              }
            : user
        )
      );

      closeModal();
    }
  };

  /*
    ==========================================
    DELETE USER
    ==========================================
  */

  const deleteUser = (user: User) => {
    const confirmed = window.confirm(
      `Delete ${user.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    setUsers((current) =>
      current.filter((item) => item.id !== user.id)
    );
  };

  /*
    ==========================================
    PDF IMPORT
    ==========================================
  */

  const openImportFile = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    setImportedFileName(file.name);

    alert(`Selected PDF: ${file.name}`);

    /*
      ตอนนี้เป็น Frontend อย่างเดียว
      เมื่อทำ Backend ภายหลัง
      ตรงนี้จะส่ง PDF ไป API เพื่ออ่านรายชื่อ
      แล้วเพิ่ม users ลง PostgreSQL
    */
  };

  return (
    <section className="adminPanelPage">
      <div className="userManagementCard">
        {/* ==============================
            TOOLBAR
        ============================== */}

        <div className="userManagementToolbar">
          <h1>User Management</h1>

          <div className="userManagementActions">
            <div className="adminSearchBox">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder=""
                aria-label="Search users"
              />

              <span className="adminSearchIcon">
                ⌕
              </span>
            </div>

            <select
              className="roleFilter"
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>

            <button
              type="button"
              className="addUserButton"
              onClick={openAddUser}
            >
              + Add User
            </button>

            <button
              type="button"
              className="importUserButton"
              onClick={openImportFile}
            >
              <img
                src="/icons/import.png"
                alt=""
                className="importImageIcon"
              />
              import
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              hidden
              onChange={handleImportFile}
            />
          </div>
        </div>

        {importedFileName && (
          <div className="importedFileNotice">
            Selected PDF: {importedFileName}
          </div>
        )}

        {/* ==============================
            TABLE
        ============================== */}

        <div className="adminUserTableWrapper">
          <table className="adminUserTable">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name - Surname</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="adminUserId">
                      <span className="adminAvatar">
                        <img
                          src="/icons/user.png"
                          alt=""
                          className="adminAvatarImage"
                        />
                      </span>

                      <span>{user.id}</span>
                    </div>
                  </td>

                  <td>{user.fullName}</td>

                  <td>
                    <span className="adminRole">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <div className="adminActionButtons">
                      <button
                        type="button"
                        className="editUserButton"
                        aria-label={`Edit ${user.fullName}`}
                        onClick={() => openEditUser(user)}
                      >
                        <img
                          src="/icons/edit.png"
                          alt="Edit"
                          className="adminActionIcon"
                        />
                      </button>

                      <button
                        type="button"
                        className="deleteUserButton"
                        aria-label={`Delete ${user.fullName}`}
                        onClick={() =>
                          deleteUser(user)
                        }
                      >
                        <img
                          src="/icons/delete.png"
                          alt="Delete"
                          className="adminActionIcon"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="noUsersFound"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==============================
          ADD / EDIT MODAL
      ============================== */}

      {modalMode && (
        <div
          className="adminModalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="adminUserModal"
            role="dialog"
            aria-modal="true"
          >
            <div className="adminModalHeading">
              <h2>
                {modalMode === "add"
                  ? "Add User"
                  : "Edit User"}
              </h2>

              <p>
                {modalMode === "add"
                  ? "Add a new user to the system"
                  : "Edit user information"}
              </p>
            </div>

            <form
              className="adminUserForm"
              onSubmit={handleSubmit}
            >
              {/* FULL NAME */}

              <div className="adminFormGroup">
                <label>
                  Full Name
                  <span className="requiredStar">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) =>
                    updateForm(
                      "fullName",
                      event.target.value
                    )
                  }
                  placeholder="Enter Full Name"
                />
              </div>

              {/* EMAIL */}

              <div className="adminFormGroup">
                <label>
                  Email Address
                  <span className="requiredStar">
                    *
                  </span>
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateForm(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="Enter email address"
                />
              </div>

              {/* ROLE + STUDENT ID */}

              <div className="adminFormDouble">
                <div className="adminFormGroup">
                  <label>
                    Role
                    <span className="requiredStar">
                      *
                    </span>
                  </label>

                  <select
                    value={form.role}
                    onChange={(event) => {
                      const role =
                        event.target.value as Role;

                      setForm((current) => ({
                        ...current,
                        role,
                        studentId:
                          role === "Student"
                            ? current.studentId
                            : "",
                      }));
                    }}
                  >
                    <option value="Student">
                      Student
                    </option>

                    <option value="Teacher">
                      Teacher
                    </option>

                    <option value="Admin">
                      Admin
                    </option>
                  </select>
                </div>

                <div className="adminFormGroup">
                  <label>Student ID</label>

                  <input
                    type="text"
                    value={form.studentId}
                    disabled={
                      form.role !== "Student"
                    }
                    onChange={(event) =>
                      updateForm(
                        "studentId",
                        event.target.value
                      )
                    }
                    placeholder={
                      form.role === "Student"
                        ? "Enter student ID"
                        : "Only for Student"
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="adminFormGroup">
                <div className="passwordLabelRow">
                  <label>
                    Password
                    <span className="requiredStar">
                      *
                    </span>
                  </label>

                  <button
                    type="button"
                    className="generatePasswordButton"
                    onClick={
                      handleGeneratePassword
                    }
                  >
                    Generate password
                  </button>
                </div>

                <div className="passwordInputWrapper">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    onChange={(event) =>
                      updateForm(
                        "password",
                        event.target.value
                      )
                    }
                    placeholder="Enter password"
                  />

                  <button
                    type="button"
                    className="passwordEyeButton"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "◉" : "◉"}
                  </button>
                </div>
              </div>

              {/* MODAL BUTTONS */}

              <div className="adminModalButtons">
                <button
                  type="button"
                  className="adminCancelButton"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="adminSubmitButton"
                >
                  {modalMode === "add"
                    ? "Add User"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}