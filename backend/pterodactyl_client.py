import httpx
from typing import Dict, Any, Optional, List
from config import settings
import logging

logger = logging.getLogger(__name__)

class PterodactylClient:
    def __init__(self):
        self.base_url = settings.PTERODACTYL_PANEL_URL
        self.api_key = settings.PTERODACTYL_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/vnd.pterodactyl.v1+json",
            "Content-Type": "application/json"
        }
    
    async def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        **kwargs
    ) -> Dict[str, Any]:
        """Make HTTP request to Pterodactyl API"""
        url = f"{self.base_url}/api/application{endpoint}"
        
        try:
            async with httpx.AsyncClient(
                headers=self.headers,
                timeout=30.0,
                verify=False  # For self-signed certificates
            ) as client:
                response = await client.request(method, url, **kwargs)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Pterodactyl API error: {e.response.status_code} - {e.response.text}")
            raise Exception(f"Pterodactyl API error: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Request failed: {e}")
            raise Exception(f"Request failed: {str(e)}")
    
    async def create_user(
        self,
        email: str,
        username: str,
        first_name: str,
        last_name: str,
        external_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create user in Pterodactyl Panel"""
        data = {
            "email": email,
            "username": username,
            "first_name": first_name,
            "last_name": last_name,
            "root_admin": False
        }
        
        if external_id:
            data["external_id"] = external_id
        
        result = await self._make_request("POST", "/users", json=data)
        return result["attributes"]
    
    async def get_user(self, user_id: int) -> Dict[str, Any]:
        """Get user details"""
        result = await self._make_request("GET", f"/users/{user_id}")
        return result["attributes"]
    
    async def list_locations(self) -> List[Dict[str, Any]]:
        """List all available locations"""
        result = await self._make_request("GET", "/locations")
        return [item["attributes"] for item in result.get("data", [])]
    
    async def list_nests(self) -> List[Dict[str, Any]]:
        """List all nests (server types)"""
        result = await self._make_request("GET", "/nests", params={"include": "eggs"})
        return [item["attributes"] for item in result.get("data", [])]
    
    async def get_minecraft_egg(self) -> Optional[Dict[str, Any]]:
        """Get Minecraft egg from nests"""
        nests = await self.list_nests()
        
        for nest in nests:
            if "minecraft" in nest.get("name", "").lower():
                eggs = nest.get("relationships", {}).get("eggs", {}).get("data", [])
                if eggs:
                    return eggs[0]["attributes"]
        
        # Return first available egg as fallback
        if nests:
            eggs = nests[0].get("relationships", {}).get("eggs", {}).get("data", [])
            if eggs:
                return eggs[0]["attributes"]
        
        return None
    
    async def create_server(
        self,
        name: str,
        user_id: int,
        egg_id: int,
        docker_image: str,
        startup: str,
        memory_limit: int,
        disk_limit: int,
        cpu_limit: int = 0,
        location_id: Optional[int] = None,
        external_id: Optional[str] = None,
        environment: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Create server in Pterodactyl Panel"""
        
        # Get first available location if not provided
        if not location_id:
            locations = await self.list_locations()
            if locations:
                location_id = locations[0]["id"]
            else:
                raise Exception("No locations available")
        
        data = {
            "name": name,
            "user": user_id,
            "egg": egg_id,
            "docker_image": docker_image,
            "startup": startup,
            "limits": {
                "memory": memory_limit,
                "swap": 0,
                "disk": disk_limit,
                "io": 500,
                "cpu": cpu_limit
            },
            "feature_limits": {
                "databases": 1,
                "allocations": 1,
                "backups": 2
            },
            "deploy": {
                "locations": [location_id],
                "dedicated_ip": False,
                "port_range": []
            },
            "start_on_completion": True
        }
        
        if external_id:
            data["external_id"] = external_id
        
        if environment:
            data["environment"] = environment
        
        result = await self._make_request("POST", "/servers", json=data)
        return result["attributes"]
    
    async def get_server(self, server_id: int) -> Dict[str, Any]:
        """Get server details"""
        result = await self._make_request(
            "GET",
            f"/servers/{server_id}",
            params={"include": "allocations,user"}
        )
        return result["attributes"]
    
    async def list_servers(self, user_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """List servers with optional user filter"""
        params = {"include": "allocations,user"}
        
        if user_id:
            params["filter[user]"] = user_id
        
        result = await self._make_request("GET", "/servers", params=params)
        return [item["attributes"] for item in result.get("data", [])]