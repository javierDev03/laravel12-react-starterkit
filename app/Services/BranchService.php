<?php

namespace App\Services;
use App\Models\Branch;

class BranchService
{
    public function list(int $perPage = 10)
    {
        return Branch::orderBy('name')->paginate($perPage);
    }

    public function create(array $data): Branch
    {
        return Branch::create($data);
    }

    public function update(Branch $branch, array $data): Branch
    {
        $branch->update($data);
        return $branch;
    }

    public function delete(Branch $branch): bool
    {
        return $branch->delete();
    }
}
