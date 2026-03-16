from openai import OpenAI, AsyncOpenAI
from pathlib import Path
import load_dotenv
rootdir = Path(__file__).parent.parent.parent.parent

def setup_environment():
    env_local_path = rootdir / ".env.local"
    env_path = rootdir / ".env"

    if env_local_path:
        load_dotenv(env_local_path)
    elif env_path:
        load_dotenv(env_path)
    else:
        load_dotenv()

    return AsyncOpenAI()


if __name__ == "__main__":
    client = setup_environment()