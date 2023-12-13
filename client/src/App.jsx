import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from "@mantine/core"
import { TextInput, Button, Group, Box } from "@mantine/core"
import useForm from "@mantine/form"

const theme = createTheme({
  primaryColor: "#a30013"
})

function LoginForm() {
  const form = useForm({
    initialValues: {
      username: ""
    }
  })

  return (
    <Box>
      <h1>Hello</h1>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          label="username"
          // {...form.getInputProps("")}
        />
      </form>
    </Box>
  )
}

function App() {
  return (
    <h1>ajsdjsd</h1>
    // <LoginForm />
  )
}

export default App
