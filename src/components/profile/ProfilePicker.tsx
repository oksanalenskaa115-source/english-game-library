import { useState, type FormEvent } from 'react'
import { studentAvatars } from '../../data/studentAvatars'
import { useStudent } from '../../hooks/useStudent'
import type { StudentAvatarId } from '../../types'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { Modal } from '../modals/Modal'
import styles from './ProfilePicker.module.css'

export function ProfilePicker() {
  const {
    students,
    selectedStudent,
    isProfilePickerOpen,
    createStudent,
    selectStudent,
    closeProfilePicker,
  } = useStudent()
  const [name, setName] = useState('')
  const [avatarId, setAvatarId] = useState<StudentAvatarId>('explorer')
  const [error, setError] = useState('')

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanName = name.trim()

    if (!cleanName) {
      setError('Enter the student name.')
      return
    }

    if (cleanName.length > 24) {
      setError('The name can contain up to 24 characters.')
      return
    }

    createStudent(cleanName, avatarId)
    setName('')
    setAvatarId('explorer')
    setError('')
  }

  return (
    <Modal
      isOpen={isProfilePickerOpen}
      title="Choose Your Explorer"
      onClose={closeProfilePicker}
    >
      <div className={styles.picker}>
        {students.length > 0 && (
          <section aria-labelledby="existing-profiles-title">
            <h3 id="existing-profiles-title">Who is playing?</h3>
            <div className={styles.profileList}>
              {students.map((student) => {
                const avatar = studentAvatars.find((item) => item.id === student.avatarId) ?? studentAvatars[0]
                const isSelected = selectedStudent?.id === student.id

                return (
                  <button
                    className={`${styles.profileCard} ${isSelected ? styles.selected : ''}`}
                    key={student.id}
                    type="button"
                    onClick={() => selectStudent(student.id)}
                    aria-pressed={isSelected}
                  >
                    <span className={styles.profileAvatar} aria-hidden="true">{avatar.symbol}</span>
                    <span className={styles.profileName}>{student.name}</span>
                    <span className={styles.profileStats}>Level {student.level} · ★ {student.totalStars}</span>
                    {isSelected && <span className={styles.current}>Current</span>}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        <section className={styles.createSection} aria-labelledby="new-profile-title">
          <h3 id="new-profile-title">Create a new explorer</h3>
          <form onSubmit={submitProfile} noValidate>
            <label className={styles.nameLabel} htmlFor="student-name">Student name</label>
            <input
              className={styles.nameInput}
              id="student-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              maxLength={24}
              autoComplete="off"
              placeholder="Enter a name"
              aria-describedby={error ? 'student-name-error' : undefined}
              aria-invalid={Boolean(error)}
            />

            <fieldset className={styles.avatarFieldset}>
              <legend>Choose an avatar</legend>
              <div className={styles.avatarList}>
                {studentAvatars.map((avatar) => (
                  <button
                    className={`${styles.avatarButton} ${avatarId === avatar.id ? styles.avatarSelected : ''}`}
                    key={avatar.id}
                    type="button"
                    onClick={() => setAvatarId(avatar.id)}
                    aria-label={avatar.label}
                    aria-pressed={avatarId === avatar.id}
                  >
                    <span aria-hidden="true">{avatar.symbol}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {error && <p className={styles.error} id="student-name-error" role="alert">{error}</p>}
            <PrimaryButton fullWidth type="submit">Create Profile</PrimaryButton>
          </form>
        </section>
      </div>
    </Modal>
  )
}
